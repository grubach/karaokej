import {
  HISTORY_SIZE,
  LATENCY,
  NOTE_SCORE_RANGE,
  TIMING_TOLERANCE,
} from "../constants";
import { detect, initAudioContext } from "../utils/detect";
import { Song, SongNote } from "../utils/song";
import { beatsToTime } from "../utils/time";
import {
  getVideoTime,
  loadVideo,
  pauseVideo,
  playVideo,
  seekTo,
} from "../utils/player";
import { createStore } from "./store";
import { appStore } from "./app";

let lastPitch: number | null = null;
let transpose: number = 0;
let overallScore: number = 0;
let overallDetections: number = 0;
let overallNoteDetections: number = 0;
let scoreNoteId: string | null = null;
let noteScore: number = 0;
let noteDetections: number = 0;

const findTranspose = (target: number, detectedPitch: number) => {
  let transpose = 0;
  let diff = detectedPitch - target;
  while (Math.abs(diff) > 6) {
    if (diff > 0) {
      transpose -= 1;
    } else {
      transpose += 1;
    }
    diff = detectedPitch + transpose * 12 - target;
  }

  return transpose;
};

const findNearestDifference = (target: number, detectedPitch: number) => {
  const transpose = findTranspose(target, detectedPitch);
  const diff = detectedPitch + transpose * 12 - target;
  return diff;
};

const getSongNoteAtTime = (song: Song, elapsed: number, pitch: number) => {
  const notesAtTime = song.notes.filter((note) => {
    const noteStartTime =
      song.startTime + beatsToTime(note.time - TIMING_TOLERANCE, song.bpm);
    const noteEndTime =
      noteStartTime +
      beatsToTime(note.duration + 2 * TIMING_TOLERANCE, song.bpm);
    return elapsed >= noteStartTime && elapsed <= noteEndTime;
  });

  if (notesAtTime.length === 0) {
    return null;
  }

  const nearestNote = notesAtTime.reduce((prev, curr) => {
    const prevDiff = prev?.pitch
      ? findNearestDifference(prev.pitch, pitch)
      : Infinity;
    const currDiff = curr?.pitch
      ? findNearestDifference(curr.pitch, pitch)
      : Infinity;
    if (Math.abs(prevDiff) < Math.abs(currDiff)) {
      return prev;
    } else {
      return curr;
    }
  });

  return nearestNote;
};

export type GameState = {
  elapsed: number;
  elapsedWithLatency: number;
  detectedPitch: number | null;
  lastPitch: number | null;
  transpose: number;
  points: number;

  currentSongNote: SongNote | null;
  scoreNoteId: string | null;
  averageNoteScore: number;
};

const initialState: GameState = {
  elapsed: 0,
  elapsedWithLatency: 0,
  detectedPitch: null,
  lastPitch: null,
  transpose: 0,
  points: 0,

  currentSongNote: null,
  scoreNoteId: null,
  averageNoteScore: 0,
};

const initialValue: GameState[] = Array.from(
  { length: HISTORY_SIZE },
  () => initialState
);

export const gameStore = createStore(initialValue);

let currentVideoTime = 0;
const frame = () => {
  const song = appStore.getValue().song;
  if (song.id === "") {
    console.error("No song loaded");
    return;
  }

  const elapsed = currentVideoTime;
  getVideoTime().then((time) => {
    currentVideoTime = time;
  });

  if (elapsed > song.endTime) {
    stopGame();
    const percentScored = (overallScore / overallNoteDetections) * 100;
    appStore.updateValue((store) => ({
      ...store,
      appPhase: "finished",
      percentScored,
    }));
    return;
  }

  let detectedPitch = detect();

  if (detectedPitch !== null) {
    lastPitch = detectedPitch;
  }

  const anyPitch = detectedPitch ?? lastPitch;

  const elapsedWithLatency = elapsed - LATENCY;
  const currentSongNote = getSongNoteAtTime(
    song,
    elapsed,
    anyPitch ?? song.averagePitch
  );
  const scoreSongNote = getSongNoteAtTime(
    song,
    elapsedWithLatency,
    anyPitch ?? song.averagePitch
  );

  transpose =
    detectedPitch && scoreSongNote?.pitch
      ? findTranspose(scoreSongNote?.pitch, detectedPitch)
      : transpose;

  const difference =
    scoreSongNote?.pitch && anyPitch
      ? findNearestDifference(scoreSongNote.pitch, anyPitch)
      : null;

  let points = 0;

  if (difference !== null && Math.abs(difference) < NOTE_SCORE_RANGE) {
    points = (NOTE_SCORE_RANGE - Math.abs(difference)) / NOTE_SCORE_RANGE;
  }

  overallScore += points;
  overallDetections += 1;
  if (scoreSongNote) {
    overallNoteDetections += 1;
  }

  if (scoreSongNote) {
    if (scoreNoteId !== scoreSongNote.id) {
      scoreNoteId = scoreSongNote.id;
      noteScore = 0;
      noteDetections = 0;
    }
    noteScore += points;
    noteDetections += 1;
  }
  const averageNoteScore = noteDetections ? noteScore / noteDetections : 0;

  const state = {
    elapsed,
    elapsedWithLatency,
    detectedPitch,
    lastPitch,
    transpose,
    points,
    currentSongNote,
    scoreNoteId,
    averageNoteScore,
  };

  const gameHistory = gameStore.getValue();
  gameHistory.unshift(state);
  gameHistory.pop();
  gameStore.setValue(gameHistory);
};

export const loadSong = (newSong: Song) => {
  const { song } = appStore.getValue();
  if (song?.id !== newSong.id) {
    loadVideo(newSong.video);
  }
  appStore.updateValue((store) => ({
    ...store,
    song: newSong,
  }));
};

let playing = false;

let countStartTime = performance.now();
let frameCount = 0;
let fpsMetricPeriod = 10;
const proceedGame = async () => {
  const currentTime = performance.now();
  if (currentTime - countStartTime > 1000 * fpsMetricPeriod) {
    const fps = frameCount / fpsMetricPeriod;
    console.log("FPS:", fps);
    countStartTime = currentTime;
    frameCount = 0;
  }
  frameCount += 1;

  frame();

  if (playing) {
    requestAnimationFrame(proceedGame);
  }
};

export const stopGame = () => {
  playing = false;

  pauseVideo();
  return true;
};

export const restartGame = () => {
  seekTo(0);
  setTimeout(() => {
    startGame();
  }, 100);
  return true;
};

export const startGame = async () => {
  gameStore.resetValue();
  appStore.updateValue((store) => ({
    ...store,
    appPhase: "playing",
    percentScored: 0,
  }));
  await initAudioContext();

  currentVideoTime = 0;
  overallScore = 0;
  overallDetections = 0;
  overallNoteDetections = 0;
  lastPitch = null;

  playVideo();

  if (!playing) {
    playing = true;
    proceedGame();
  }

  return true;
};

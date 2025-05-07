import { DETECTIONS_PER_SECOND, LATENCY, NOTE_SCORE_RANGE } from "../constants";
import { detect, initAudioContext } from "../utils/detect";
import { beatsToTime } from "../utils/time";
import { pauseVideo, seekTo } from "../utils/player";
import { appStore } from "../store/app";
import { gameStore } from "../store/game";
import { SongScored } from "../songs";
import { loadSongScored, SongNote } from "../utils/song";

// code for training game mode

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

const getSongNoteAtTime = (
  song: SongScored,
  notes: SongNote[],
  elapsed: number,
  pitch: number
) => {
  const notesAtTime = notes.filter((note) => {
    const noteStartTime = song.startTime + beatsToTime(note.time, song.bpm);
    const noteEndTime = noteStartTime + beatsToTime(note.duration, song.bpm);
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

let currentVideoTime = 0;
const frame = () => {
  const { song, averagePitch, notes } = appStore.getValue();
  if (song.id === "") {
    console.error("No song loaded");
    return;
  }

  const elapsed = currentVideoTime;

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
    notes,
    elapsed,
    anyPitch ?? averagePitch
  );
  const scoreSongNote = currentSongNote;

  transpose =
    detectedPitch && scoreSongNote?.pitch
      ? findTranspose(scoreSongNote?.pitch, detectedPitch)
      : transpose;

  const difference =
    scoreSongNote?.pitch && detectedPitch
      ? findNearestDifference(scoreSongNote.pitch, detectedPitch)
      : null;

  const PITCH_TRAINING_TOLERANCE = 0.25;
  const timeProgress = 1 / DETECTIONS_PER_SECOND;

  if (!scoreSongNote?.pitch) {
    currentVideoTime += timeProgress;
  } else if (
    difference !== null &&
    Math.abs(difference) < PITCH_TRAINING_TOLERANCE
  ) {
    const accuraccy = 1 - Math.abs(difference) / PITCH_TRAINING_TOLERANCE;
    currentVideoTime += timeProgress * accuraccy;
  }

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

export const loadGame = async (newSong: SongScored) => {
  loadSongScored(newSong);
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

  if (!playing) {
    playing = true;
    proceedGame();
  }

  return true;
};

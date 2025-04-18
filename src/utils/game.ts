import { DETECTIONS_PER_SECOND, HISTORY_SIZE, LATENCY } from "../constants";
import { detect, resetAudioContext } from "./detect";
import { Song } from "./song";
import { beatsToTime } from "./time";
import { getVideoTime, loadVideo, pauseVideo, playVideo } from "./player";

let song: Song | null = null;

let lastPitch: number | null = null;
let interval: number;
let transpose: number = 0;
let overallScore: number = 0;
let overallDetections: number = 0;
let overallNoteDetections: number = 0;
let noteIndex: number = 0;
let noteScore: number = 0;
let noteDetections: number = 0;

const getCurrentSongNote = (song: Song, elapsed: number) => {
  return (
    song.notes
      .filter((note) => note.pitch !== null)
      .find((note) => {
        const noteStartTime = song.startTime + beatsToTime(note.time, song.bpm);
        const noteEndTime =
          noteStartTime + beatsToTime(note.duration, song.bpm);
        return elapsed >= noteStartTime && elapsed <= noteEndTime;
      }) ?? null
  );
};
const getNextSongNote = (song: Song, elapsed: number) => {
  return (
    song.notes
      .filter((note) => note.pitch !== null)
      .find((note) => {
        const noteStartTime = song.startTime + beatsToTime(note.time, song.bpm);
        const noteEndTime =
          noteStartTime + beatsToTime(note.duration, song.bpm);
        return elapsed <= noteEndTime;
      }) ?? null
  );
};

export type GameState = {
  elapsed: number;
  detectedPitch: number | null;
  lastPitch: number | null;
  transpose: number;
  points: number;

  noteIndex: number;
  averageNoteScore: number;
};

const initialState: GameState = {
  elapsed: 0,
  detectedPitch: null,
  lastPitch: null,
  transpose: 0,
  points: 0,

  noteIndex: -1,
  averageNoteScore: 0,
};

const gameHistory: GameState[] = Array.from(
  { length: HISTORY_SIZE },
  () => initialState
);

export const getGameHistory = () => gameHistory;
const resetGameHistory = () => {
  for (let i = 0; i < HISTORY_SIZE; i++) {
    gameHistory[i] = initialState;
  }
};

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

const frame = async () => {
  if (!song) {
    console.error("No song loaded");
    return;
  }

  const elapsed = await getVideoTime();

  if (elapsed > song.endTime) {
    clearInterval(interval);
    pauseVideo();
    interval = 0;
    console.log("Game Over");
    console.log("Score:", overallScore);
    console.log("Detections:", overallDetections);
    console.log("Note Detections:", overallNoteDetections);
    console.log("Percenatage:", (overallScore / overallNoteDetections) * 100);
    return;
  }

  const detectedPitch = detect(); //?? lastPitch;
  if (detectedPitch !== null) {
    lastPitch = detectedPitch;
  }

  const currentSongNote = getCurrentSongNote(song, elapsed - LATENCY);
  const nextSongNote =
    getNextSongNote(song, elapsed - LATENCY) ?? currentSongNote;

  transpose =
    nextSongNote?.pitch && detectedPitch
      ? findTranspose(nextSongNote.pitch, detectedPitch)
      : transpose;

  const anyPitch = detectedPitch ?? lastPitch;
  const difference =
    currentSongNote?.pitch && anyPitch
      ? findNearestDifference(currentSongNote.pitch, anyPitch)
      : null;

  let points = 0;
  const pointsRange = 1;
  if (difference !== null && Math.abs(difference) < pointsRange) {
    points = (pointsRange - Math.abs(difference)) / pointsRange;
  }

  overallScore += points;
  overallDetections += 1;
  if (currentSongNote) {
    overallNoteDetections += 1;
  }

  if (currentSongNote) {
    if (noteIndex !== currentSongNote.index) {
      noteIndex = currentSongNote.index;
      noteScore = 0;
      noteDetections = 0;
    }
    noteScore += points;
    noteDetections += 1;
  }
  const averageNoteScore = noteDetections ? noteScore / noteDetections : 0;

  const state = {
    elapsed,
    detectedPitch,
    lastPitch,
    transpose,
    points,
    noteIndex,
    averageNoteScore,
  };

  gameHistory.unshift(state);
  gameHistory.pop();
};

export const loadSong = (newSong: Song) => {
  song = newSong;
  loadVideo(newSong.video);
};

export const stopGame = () => {
  if (interval) {
    clearInterval(interval);
  }
  pauseVideo();
  interval = 0;
  return true;
};

export const startGame = async () => {
  resetGameHistory();
  await resetAudioContext();
  overallScore = 0;
  overallDetections = 0;
  overallNoteDetections = 0;
  lastPitch = null;

  if (interval) {
    clearInterval(interval);
  }

  playVideo();

  interval = setInterval(frame, 1000 / DETECTIONS_PER_SECOND);
  return true;
};

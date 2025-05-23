import {
  DETECTIONS_PER_SECOND,
  LATENCY,
  PITCH_TRAINING_TOLERANCE,
  TRAIN_TIMING_TOLERANCE,
} from "../constants";
import { detect, initAudioContext } from "../utils/detect";
import { beatsToTime } from "../utils/time";
import { appStore } from "../store/app";
import { gameStore } from "../store/game";
import { SongScored } from "../songs";
import { loadSongScored } from "../utils/song";
import { findTranspose, findNearestDifference, getSongNoteAtTime } from "../utils/pitchUtils";

// code for training game mode

let lastPitch: number | null = null;
let transpose: number = 0;
let overallScore: number = 0;
let overallDetections: number = 0;
let overallNoteDetections: number = 0;
let scoreNoteId: string | null = null;
let noteScore: number = 0;
let noteDetections: number = 0;

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
    anyPitch ?? averagePitch,
    TRAIN_TIMING_TOLERANCE
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

  if (scoreSongNote && scoreNoteId !== scoreSongNote.id) {
    scoreNoteId = scoreSongNote.id;
    noteScore = 0;
    noteDetections = 0;
  }

  const timeProgress = 1 / DETECTIONS_PER_SECOND;
  let points = 0;

  if (currentVideoTime < song.startTime) {
    currentVideoTime = song.startTime;
  } else if (!scoreSongNote) {
    currentVideoTime += timeProgress;
  } else if (!scoreSongNote?.pitch) {
    const noteStartTime =
      song.startTime + beatsToTime(scoreSongNote.time, song.bpm);
    const noteEndTime =
      noteStartTime + beatsToTime(scoreSongNote.duration, song.bpm);
    currentVideoTime = noteEndTime + timeProgress;
  } else if (
    difference !== null &&
    Math.abs(difference) < PITCH_TRAINING_TOLERANCE
  ) {
    points = 1 - Math.abs(difference) / PITCH_TRAINING_TOLERANCE;
    currentVideoTime += timeProgress * points;

    overallScore += points;
    noteScore += points;

    overallDetections += 1;
    overallNoteDetections += 1;
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
  return true;
};

export const resumeGame = () => {
  if (!playing) {
    playing = true;
    proceedGame();
  }
  return true;
};

export const seekGame = (time: number) => {
  currentVideoTime = time;
  return true;
}

export const restartGame = () => {
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

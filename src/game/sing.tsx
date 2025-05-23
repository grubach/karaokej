import { LATENCY, NOTE_SCORE_RANGE, SING_TIMING_TOLERANCE } from "../constants";
import { detect, initAudioContext } from "../utils/detect";
import {
  getVideoTime,
  loadVideo,
  pauseVideo,
  playVideo,
  seekTo,
} from "../utils/player";
import { appStore } from "../store/app";
import { gameStore } from "../store/game";
import { SongScored } from "../songs";
import { loadSongScored } from "../utils/song";
import { findTranspose, findNearestDifference, getSongNoteAtTime } from "../utils/pitchUtils";

// code for singing game mode

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
    notes,
    elapsed,
    anyPitch ?? averagePitch,
    SING_TIMING_TOLERANCE
  );
  const scoreSongNote = getSongNoteAtTime(
    song,
    notes,
    elapsedWithLatency,
    anyPitch ?? averagePitch,
    SING_TIMING_TOLERANCE
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

export const loadGame = async (newSong: SongScored) => {
  const { song } = appStore.getValue();
  if (song?.id !== newSong.id) {
    await loadVideo(newSong.karaokeVideo);
  }
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

export const stopGame = async () => {
  playing = false;

  await pauseVideo();
  return true;
};

export const resumeGame = async () => {
  await playVideo();
  if (playing) {
    return true;
  }
  playing = true;
  proceedGame();
  return true;
};

export const seekGame = async (time: number) => {
  await seekTo(time);
  currentVideoTime = time;
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

  await playVideo();

  if (!playing) {
    playing = true;
    proceedGame();
  }

  return true;
};

import { DETECTIONS_PER_SECOND, HISTORY_SIZE, LATENCY } from "../constants";
import { detect, initAudioContext } from "./detect";
import { Song, SongNote } from "./song";
import { beatsToTime } from "./time";
import { getVideoTime, loadVideo, pauseVideo, playVideo } from "./player";

let song: Song | null = null;

let lastPitch: number | null = null;
let interval: number;
let transpose: number = 0;
let overallScore: number = 0;
let overallDetections: number = 0;
let overallNoteDetections: number = 0;
let scoreNoteId: string | null = null;
let noteScore: number = 0;
let noteDetections: number = 0;

const getCurrentSongNote = (song: Song, elapsed: number) => {
  return (
    song.notes
      // .filter((note) => note.pitch !== null)
      .find((note) => {
        const noteStartTime = song.startTime + beatsToTime(note.time, song.bpm);
        const noteEndTime =
          noteStartTime + beatsToTime(note.duration, song.bpm);
        return elapsed >= noteStartTime && elapsed <= noteEndTime;
      }) ?? null
  );
};
const getNextSongPitchNote = (song: Song, elapsed: number) => {
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

const gameHistory: GameState[] = Array.from(
  { length: HISTORY_SIZE },
  () => initialState
);

// export const getGameHistory = () => gameHistory;
const resetGameHistory = () => {
  for (let i = 0; i < HISTORY_SIZE; i++) {
    gameHistory[i] = initialState;
  }
};

const subscribtions: Record<string, ((history: GameState[]) => void)[]> = {};

export const subscribe = (
  id: string,
  callback: (history: GameState[]) => void
) => {
  if (!subscribtions[id]) {
    subscribtions[id] = [];
  }
  subscribtions[id].push(callback);

  const unsubscribe = () => {
    if (subscribtions[id]) {
      subscribtions[id] = subscribtions[id].filter((cb) => cb !== callback);
    }
  };
  return unsubscribe;
};

const notifySubscriber = (id: string) => {
  if (subscribtions[id]) {
    subscribtions[id].forEach((callback) => {
      callback(gameHistory);
    });
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

let currentVideoTime = 0;
const frame = () => {
  if (!song) {
    console.error("No song loaded");
    return;
  }

  const elapsed = currentVideoTime;
  getVideoTime().then((time) => {
    currentVideoTime = time;
  });

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

  let detectedPitch = detect();

  if (detectedPitch !== null) {
    lastPitch = detectedPitch;
  }

  const anyPitch = detectedPitch ?? lastPitch;

  const elapsedWithLatency = elapsed - LATENCY;
  const currentSongNote = getCurrentSongNote(song, elapsed);
  const scoreSongNote = getCurrentSongNote(song, elapsedWithLatency);
  const nextSongPitchNote =
    getNextSongPitchNote(song, elapsedWithLatency) ?? currentSongNote;

  transpose = detectedPitch
    ? findTranspose(
        nextSongPitchNote?.pitch ?? song.averagePitch,
        detectedPitch
      )
    : transpose;

  const difference =
    scoreSongNote?.pitch && anyPitch
      ? findNearestDifference(scoreSongNote.pitch, anyPitch)
      : null;

  let points = 0;
  const pointsRange = 1;
  if (difference !== null && Math.abs(difference) < pointsRange) {
    points = (pointsRange - Math.abs(difference)) / pointsRange;
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

  gameHistory.unshift(state);
  gameHistory.pop();

  notifySubscriber("cursor");
  notifySubscriber("program");
  notifySubscriber("wait");

  if (scoreNoteId !== null) {
    notifySubscriber(scoreNoteId);
  }
};

export const loadSong = (newSong: Song) => {
  if (song?.id !== newSong.id) {
    loadVideo(newSong.video);
  }
  song = newSong;
};

let playing = false;
let lastFrameTime = 0;
const proceedGame = async () => {
  const currentTime = performance.now();
  if (Math.random() < 0.01) {
    const fps = 1000 / (currentTime - lastFrameTime);
    console.log("FPS:", fps);
  }
  lastFrameTime = currentTime;

  frame();

  if (playing) {
    requestAnimationFrame(proceedGame);
  }
};

export const stopGame = () => {
  playing = false;

  pauseVideo();
  interval = 0;
  return true;
};

export const startGame = async () => {
  resetGameHistory();
  await initAudioContext();

  overallScore = 0;
  overallDetections = 0;
  overallNoteDetections = 0;
  lastPitch = null;

  playVideo();
  playing = true;
  proceedGame();

  return true;
};

import { DETECTIONS_PER_SECOND, HISTORY_SIZE } from "../constants";
import { detect, resetAudioContext } from "./detect";
import { Song, song } from "./song";
import { beatsToTime } from "./time";

let interval: number;
let startTime: number;
let transpose: number = 0;

const getCurrentSongNote = (song: Song, elapsed: number) => {
  return (
    song.notes.find((note) => {
      const noteStartTime = song.startTime + beatsToTime(note.time, song.bpm);
      const noteEndTime = noteStartTime + beatsToTime(note.duration, song.bpm);
      return elapsed >= noteStartTime && elapsed <= noteEndTime;
    }) ?? null
  );
};
const getNextSongNote = (song: Song, elapsed: number) => {
  return (
    song.notes.find((note) => {
      const noteStartTime = song.startTime + beatsToTime(note.time, song.bpm);
      return elapsed < noteStartTime;
    }) ?? null
  );
};

export type GameState = {
  elapsed: number;
  detectedPitch: number | null;
  transpose: number;
  points: number;
};

const initialState: GameState = {
  elapsed: 0,
  detectedPitch: null,
  transpose: 0,
  points: 0,
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

const findNearestDifference = (target: number, detectedPitch: number) => {
  const difference = (target - detectedPitch) % 12;
  return difference > 6 ? difference - 12 : difference;
};

const findTranspose = (target: number, detectedPitch: number) => {
  const difference = findNearestDifference(target, detectedPitch);
  return target - difference - detectedPitch;
};

const frame = () => {
  const now = performance.now();
  const elapsed = now - startTime;

  if (elapsed > song.endTime) {
    clearInterval(interval);
    return;
  }

  const detectedPitch = detect();
  const currentSongNote = getCurrentSongNote(song, elapsed);
  const nextSongNote = getNextSongNote(song, elapsed) ?? currentSongNote;

  transpose =
    nextSongNote && detectedPitch
      ? findTranspose(nextSongNote.position, detectedPitch)
      : transpose;

  const difference =
    currentSongNote && detectedPitch
      ? findNearestDifference(currentSongNote.position, detectedPitch)
      : null;

  let points = 0;
  if (difference !== null && Math.abs(difference) < 1) {
    points = 1 - Math.abs(difference);
  }

  const state = {
    elapsed,
    detectedPitch,
    transpose,
    points,
  };

  gameHistory.unshift(state);
  gameHistory.pop();
};

export const startGame = async () => {
  resetGameHistory();
  await resetAudioContext();
  startTime = performance.now();
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(frame, 1000 / DETECTIONS_PER_SECOND);
  return true;
};

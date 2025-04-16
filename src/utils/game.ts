import { DETECTIONS_PER_SECOND } from "../constants";
import { detect, resetAudioContext } from "./detect";
import { Song, song, SongItem } from "./song";
import { beatsToTime } from "./time";

let interval: number;
let startTime: number;

const getCurrentSongNote = (song: Song, elapsed: number) => {
  return (
    song.notes.find((note) => {
      const noteStartTime = song.startTime + beatsToTime(note.time, song.bpm);
      const noteEndTime = noteStartTime + beatsToTime(note.duration, song.bpm);
      return elapsed >= noteStartTime && elapsed <= noteEndTime;
    }) ?? null
  );
};

export type GameState = {
  song: Song | null;
  currentNote: SongItem | null;
  elapsed: number;
  detectedPitch: number | null;
  transpose: number;
};

let state: GameState = {
  song: null,
  currentNote: null,
  elapsed: 0,
  detectedPitch: null,
  transpose: 0,
};

export const getGameState = () => state;
const resetGameState = () => {
  state = {
    song: null,
    currentNote: null,
    elapsed: 0,
    detectedPitch: null,
    transpose: 0,
  };
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
  const currentNote = getCurrentSongNote(song, elapsed);

  state = {
    song,
    currentNote,
    elapsed,
    detectedPitch,
    transpose:
      currentNote && detectedPitch
        ? findTranspose(currentNote.position, detectedPitch)
        : state.transpose,
  };
};

export const startGame = async () => {
  resetGameState();
  await resetAudioContext();
  startTime = performance.now();
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(frame, 1000 / DETECTIONS_PER_SECOND);
  return true;
};

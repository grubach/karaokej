import { HISTORY_SIZE } from "../constants";
import { SongNote } from "../utils/song";

import { createStore } from "./store";

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

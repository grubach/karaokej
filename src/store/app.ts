import { SongNote } from "../utils/song";
import { createStore } from "./store";
import { PlayerState } from "../utils/player";
import { emptySong, SongScored } from "../songs";

export type AppPhase = "unstarted" | "playing" | "finished";

export type GameMode = "sing" | "train";

export type AppState = {
  song: SongScored;
  playerState: PlayerState;
  speed: number;
  listOpen: boolean;
  appPhase: AppPhase;
  percentScored: number;
  averagePitch: number;
  notes: SongNote[];
  gameMode: GameMode;
};

const initialState: AppState = {
  song: emptySong,
  playerState: "unstarted",
  speed: 1,
  listOpen: true,
  appPhase: "unstarted",
  percentScored: 0,
  averagePitch: 0,
  notes: [],
  gameMode: "sing",
};

export const appStore = createStore(initialState);

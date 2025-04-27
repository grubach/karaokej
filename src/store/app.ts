import { emptySong, Song } from "../utils/song";
import { createStore } from "./store";
import { PlayerState } from "../utils/player";

export type AppPhase = "unstarted" | "playing" | "finished";

export type AppState = {
  song: Song;
  playerState: PlayerState;
  speed: number;
  listOpen: boolean;
  appPhase: AppPhase;
  percentScored: number;
};

const initialState: AppState = {
  song: emptySong,
  playerState: "unstarted",
  speed: 1,
  listOpen: true,
  appPhase: "unstarted",
  percentScored: 0,
};

export const appStore = createStore(initialState);

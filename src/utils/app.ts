import { emptySong, Song } from "./song";
import { createStore } from "./store";
import { PlayerState } from "./player";

export type AppState = {
  song: Song;
  playerState: PlayerState;
  speed: number;
  listOpen: boolean;
};

const initialState: AppState = {
  song: emptySong,
  playerState: "unstarted",
  speed: 1,
  listOpen: true,
};

export const appStore = createStore(initialState);

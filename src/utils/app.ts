import { emptySong, Song } from "./song";
import { createStore } from "./store";
import { PlayerState } from "./player";

export type AppState = {
  song: Song;
  playerState: PlayerState
};

const initialState: AppState = {
  song: emptySong,
  playerState: 'unstarted',
};

export const appStore = createStore(initialState);

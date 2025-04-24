import { emptySong, Song } from "./song";
import { createStore } from "./store";

export type AppState = {
  song: Song;
  playerState: "idle" | "loading" | "playing" | "paused" | "stopped";
};

const initialState: AppState = {
  song: emptySong,
  playerState: "idle",
};

export const appStore = createStore(initialState);

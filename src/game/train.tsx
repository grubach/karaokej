import { SongScored } from "../songs";
import { appStore } from "../store/app";
import { loadVideo } from "../utils/player";

export const loadSong = (newSong: SongScored) => {
  const { song } = appStore.getValue();
  if (song?.id !== newSong.id) {
    loadVideo(newSong.karaokeVideo);
  }
  appStore.updateValue((store) => ({
    ...store,
    song: newSong,
  }));
};

export const startGame = () => {};

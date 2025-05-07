import { SongScored } from "../songs";
import { appStore } from "../store/app";
import * as sing from "./sing";
import * as train from "./train";

export const loadGame = (newSong: SongScored) => {
  const { gameMode } = appStore.getValue();
  if (gameMode === "sing") {
    return sing.loadGame(newSong);
  } else {
    return train.loadGame(newSong);
  }
};

export const startGame = () => {
  const { gameMode } = appStore.getValue();
  if (gameMode === "sing") {
    return sing.startGame();
  } else {
    return train.startGame();
  }
};

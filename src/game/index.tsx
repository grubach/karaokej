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

export const stopGame = () => {
  const { gameMode } = appStore.getValue();
  if (gameMode === "sing") {
    return sing.stopGame();
  } else {
    return train.stopGame();
  }
};

export const restartGame = () => {
  const { gameMode } = appStore.getValue();
  if (gameMode === "sing") {
    return sing.restartGame();
  } else {
    return train.restartGame();
  }
};

export const resumeGame = () => {
  const { gameMode } = appStore.getValue();
  if (gameMode === "sing") {
    return sing.resumeGame();
  } else {
    return train.resumeGame();
  }
};

export const seekGame = (time: number) => {
  const { gameMode } = appStore.getValue();
  if (gameMode === "sing") {
    return sing.seekGame(time);
  } else {
    return train.seekGame(time);
  }
};

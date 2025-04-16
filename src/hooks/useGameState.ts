import { DependencyList, useCallback } from "react";
import useFrameLoop from "./useFrameLoop";
import { GameState, getGameHistory } from "../utils/game";

type GameStateListener = (gameHistory: GameState[]) => void;

const useGameState = (listener: GameStateListener, deps: DependencyList) => {
  const onFrame = useCallback(() => {
    listener(getGameHistory());
  }, [listener, deps]);

  useFrameLoop(onFrame);
};

export default useGameState;

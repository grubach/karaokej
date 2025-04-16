import { DependencyList, useCallback } from "react";
import useFrameLoop from "./useFrameLoop";
import { GameState, getGameState } from "../utils/game";

type GameStateListener = (gameState: GameState) => void;

const useGameState = (listener: GameStateListener, deps: DependencyList) => {
  const onFrame = useCallback(() => {
    listener(getGameState());
  }, [listener, deps]);

  useFrameLoop(onFrame);
};

export default useGameState;

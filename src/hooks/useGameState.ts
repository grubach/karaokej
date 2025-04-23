import { DependencyList, useEffect } from "react";
import { GameState, gameStore } from "../utils/game";

type GameStateListener = (gameHistory: GameState[]) => void;

const useGameState = (
  id: string,
  listener: GameStateListener,
  deps: DependencyList
) => {
  useEffect(() => {
    const unsubscribe = gameStore.subscribe(id, listener);
    return () => {
      unsubscribe();
    };
  }, [id, listener, ...deps]);
};

export default useGameState;

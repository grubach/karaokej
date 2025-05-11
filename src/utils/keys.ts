import { startGame, resumeGame, seekGame, stopGame } from "../game";
import { appStore } from "../store/app";
import { gameStore } from "../store/game";

export const register = () => {
  const handleKeyDown = (event: KeyboardEvent) => {
    const [gameState] = gameStore.getValue();
    const appState = appStore.getValue();

    const { key } = event;

    if (key === "ArrowLeft") {
      const newxtTime = gameState.elapsed - 1;
      seekGame(newxtTime);
      return;
    }

    if (key === "ArrowRight") {
      const newxtTime = gameState.elapsed + 1;
      seekGame(newxtTime);
      return;
    }

    if (key === " ") {
      event.preventDefault();
      if (appState.playerState === "playing") {
        stopGame();
        return;
      }

      if (appState.playerState === "paused") {
        resumeGame();
        return;
      }

      startGame();
      return;
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
};

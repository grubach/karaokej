import { appStore } from "../store/app";
import { gameStore, startGame } from "../store/game";
import { pauseVideo, playVideo, seekTo } from "./player";

export const register = () => {
  const handleKeyDown = (event: KeyboardEvent) => {
    const [gameState] = gameStore.getValue();
    const appState = appStore.getValue();

    const { key } = event;

    if (key === "ArrowLeft") {
      const newxtTime = gameState.elapsed - 1;
      seekTo(newxtTime);
      return;
    }

    if (key === "ArrowRight") {
      const newxtTime = gameState.elapsed + 1;
      seekTo(newxtTime);
      return;
    }

    if (key === " ") {
      event.preventDefault();
      if (appState.playerState === "playing") {
        pauseVideo();
        return;
      }

      if (appState.playerState === "paused") {
        playVideo();
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

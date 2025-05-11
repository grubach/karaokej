import { startTransition } from "react";
import { restartGame, resumeGame, startGame, stopGame } from "../../game";
import ActionIcon from "../parts/ActionIcon";
import { FiPause, FiPlay } from "react-icons/fi";
import useStoreState from "../../hooks/useStoreState";
import { appStore } from "../../store/app";

const PlayPauseGame = () => {
  const { playerState } = useStoreState(appStore);

  const handleClick = () => {
    switch (playerState) {
      case "playing":
        stopGame();
        break;
      case "paused":
        resumeGame();
        break;
      case "video cued":
        startTransition(() => {
          startGame();
        });
        break;
      default:
        restartGame();
    }
  };

  return (
    <ActionIcon
      icon={playerState === "playing" ? FiPause : FiPlay}
      onClick={handleClick}
      tooltip={playerState === "playing" ? "Pause Game" : "Play Game"}
    />
  );
};

export default PlayPauseGame;

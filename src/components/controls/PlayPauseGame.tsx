import { startTransition, useActionState } from "react";
import { startGame } from "../../store/game";
import ActionIcon from "../parts/ActionIcon";
import { FiPause, FiPlay } from "react-icons/fi";
import useStoreState from "../../hooks/useStoreState";
import { appStore } from "../../store/app";
import { pauseVideo, playVideo, restartVideo } from "../../utils/player";

const PlayPauseGame = () => {
  const [, handleStart, isPending] = useActionState(startGame, false);
  const { playerState } = useStoreState(appStore);

  const handleClick = () => {
    switch (playerState) {
      case "playing":
        pauseVideo();
        break;
      case "paused":
        playVideo();
        break;
      case "video cued":
        startTransition(() => {
          handleStart();
        });
        break;
      default:
        restartVideo();
    }
  };

  return (
    <ActionIcon
      icon={playerState === "playing" ? FiPause : FiPlay}
      onClick={handleClick}
      disabled={isPending}
    />
  );
};
export default PlayPauseGame;

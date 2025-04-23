import { startTransition, useActionState } from "react";
import { startGame } from "../../utils/game";
import ActionIcon from "../parts/ActionIcon";
import { FiPlay, FiSkipBack } from "react-icons/fi";

const StartGame = () => {
  const [isPlaying, handleStart, isPending] = useActionState(startGame, false);

  const handleClick = () => {
    startTransition(() => {
      handleStart();
    });
  };

  return (
    <ActionIcon
      icon={isPlaying ? FiSkipBack : FiPlay}
      onClick={handleClick}
      disabled={isPending}
    />
  );
};
export default StartGame;

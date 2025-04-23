import { startTransition, useActionState } from "react";
import { startGame } from "../../utils/game";
import ActionIcon from "../parts/ActionIcon";

const StartGame = () => {
  const [isPlaying, handleStart, isPending] = useActionState(startGame, false);

  const handleClick = () => {
    startTransition(() => {
      handleStart();
    });
  };

  return (
    <ActionIcon
      icon="▶"
      onClick={handleClick}
      disabled={isPlaying || isPending}
    />
  );
};
export default StartGame;

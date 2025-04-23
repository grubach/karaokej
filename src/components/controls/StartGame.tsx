import { startTransition, useActionState } from "react";
import { startGame } from "../../utils/game";
import ActionIcon from "../parts/ActionIcon";
import { FiPlay } from "react-icons/fi";
import { NOTE_HEIGHT } from "../../constants";

const StartGame = () => {
  const [isPlaying, handleStart, isPending] = useActionState(startGame, false);

  const handleClick = () => {
    startTransition(() => {
      handleStart();
    });
  };

  return (
    <ActionIcon
      icon={
        <FiPlay
          size={1.5 * NOTE_HEIGHT}
          strokeWidth={2}
          stroke="currentColor"
          fill="currentColor"
        />
      }
      onClick={handleClick}
      disabled={isPlaying || isPending}
    />
  );
};
export default StartGame;

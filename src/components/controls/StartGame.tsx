import { startTransition, useActionState } from "react";
import { startGame } from "../../utils/game";

const StartGame = () => {
  const [isPlaying, handleStart, isPending] = useActionState(startGame, false);

  const handleClick = () => {
    startTransition(() => {
      handleStart();
    });
  };

  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPlaying ? "Restart" : "Start"}
    </button>
  );
};
export default StartGame;

import { startTransition, useActionState } from "react";
import style from "./Controls.module.css";
import { startGame } from "./utils/game";


const Controls = () => {
  const [isPlaying, handleStart, isPending] = useActionState(
    startGame,
    false
  );

  const handleClick = () => {
    startTransition(() => {
      handleStart();
    });
  };

  return (
    <div className={style.Controls}>
      <button onClick={handleClick} disabled={isPending}>
        {isPlaying ? "Restart" : "Start"}
      </button>
    </div>
  );
};
export default Controls;

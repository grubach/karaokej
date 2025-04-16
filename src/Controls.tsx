import { startTransition, useActionState } from "react";
import style from "./Controls.module.css";
import { startDetecting } from "./utils/detect";

const Controls = () => {
  const [isDetecting, handleStartDetecting, isPending] = useActionState(
    startDetecting,
    false
  );

  const handleClick = () => {
    startTransition(() => {
      handleStartDetecting();
    });
  };

  return (
    <div className={style.controls}>
      <button onClick={handleClick} disabled={isPending}>
        {isDetecting ? "Restart" : "Start"}
      </button>
    </div>
  );
};
export default Controls;

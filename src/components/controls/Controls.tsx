import style from "./Controls.module.css";
import StartGame from "./StartGame";
import StopGame from "./StopGame";

const Controls = () => {
  return (
    <div className={style.Controls}>
      <StartGame />
      <StopGame />
    </div>
  );
};
export default Controls;

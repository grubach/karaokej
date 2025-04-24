import style from "./Controls.module.css";
import Player from "./Player";
import ProgressBar from "./ProgressBar";
import StartGame from "./StartGame";
import StopGame from "./StopGame";

const Controls = () => {
  return (
    <div className={style.Controls}>
      <Player />
      <ProgressBar />
      <StartGame />
      <StopGame />
    </div>
  );
};
export default Controls;

import style from "./Controls.module.css";
import Player from "./Player";
import ProgressBar from "./ProgressBar";
import PlayPauseGame from "./PlayPauseGame";
import StopGame from "./StopGame";
import Speed from "./Speed";

const Controls = () => {
  return (
    <div className={style.Controls}>
      <Player />
      <ProgressBar />
      <Speed />
      <PlayPauseGame />
      <StopGame />
    </div>
  );
};
export default Controls;

import style from "./Controls.module.css";
import Player from "./Player";
import ProgressBar from "./ProgressBar";
import PlayPauseGame from "./PlayPauseGame";
import Speed from "./Speed";

const Controls = () => {
  return (
    <div className={style.Controls}>
      <Player />
      <ProgressBar />
      <Speed />
      <PlayPauseGame />
    </div>
  );
};
export default Controls;

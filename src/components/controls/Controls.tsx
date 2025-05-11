import style from "./Controls.module.css";
import Player from "./Player";
import ProgressBar from "./ProgressBar";
import PlayPauseGame from "./PlayPauseGame";
import Speed from "./Speed";
import ModeSwitch from "./ModeSwitch";
import cx from "classnames";
import { appStore } from "../../store/app";
import useStoreState from "../../hooks/useStoreState";

const Controls = () => {
  const { song, gameMode } = useStoreState(appStore);
  return (
    <div
      className={cx(style.Controls, {
        [style.hidden]: !song.id,
      })}
    >
      <Player />
      <ProgressBar />
      {gameMode === "sing" && <Speed />}
      {gameMode === "sing" && <PlayPauseGame />}
      <ModeSwitch />
    </div>
  );
};

export default Controls;

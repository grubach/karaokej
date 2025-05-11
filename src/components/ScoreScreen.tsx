import { FiRotateCcw } from "react-icons/fi";
import useStoreState from "../hooks/useStoreState";
import { appStore } from "../store/app";
import ActionIcon from "./parts/ActionIcon";
import style from "./ScoreScreen.module.css";
import { restartGame } from "../game/sing";

const ScoreScreen = () => {
  const { percentScored, appPhase, song } = useStoreState(appStore);
  if (appPhase !== "finished" || song === null) return null;
  return (
    <div className={style.ScoreScreen}>
      <img
        className={style.cover}
        src={`https://img.youtube.com/vi/${song.karaokeVideo}/0.jpg`}
      />
      <div className={style.title}>{song.title}</div>
      <div className={style.artist}>{song.artist}</div>
      <div className={style.score}>{percentScored.toFixed(2)}%</div>
      <ActionIcon icon={FiRotateCcw} onClick={restartGame} tooltip="Restart Game" />
    </div>
  );
};
export default ScoreScreen;

import useStoreState from "../hooks/useStoreState";
import { appStore } from "../store/app";
import style from "./ScoreScreen.module.css";

const ScoreScreen = () => {
  const { percentScored, finished, song } = useStoreState(appStore);
  if (!finished) return null;
  return (
    <div className={style.ScoreScreen}>
      <img
        className={style.cover}
        src={`https://img.youtube.com/vi/${song.video}/0.jpg`}
      />
      <div className={style.title}>{song.title}</div>
      <div className={style.artist}>{song.artist}</div>
      <div className={style.score}>{percentScored.toFixed(2)}%</div>
    </div>
  );
};
export default ScoreScreen;

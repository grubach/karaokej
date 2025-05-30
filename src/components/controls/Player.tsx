import { useEffect } from "react";
import { loadPlayer } from "../../utils/player";
import style from "./Player.module.css";
import useStoreState from "../../hooks/useStoreState";
import { appStore } from "../../store/app";

const Player = () => {
  const { song } = useStoreState(appStore);

  useEffect(() => {
    loadPlayer();
  }, []);

  return (
    <div className={style.Player}>
      <div className={style.video}>
        <div className={style.iframe} id="video-player"></div>
      </div>
      {song.karaokeVideo && (
        <img
          className={style.cover}
          src={`https://img.youtube.com/vi/${song.karaokeVideo}/0.jpg`}
          alt={song.title}
        />
      )}
    </div>
  );
};
export default Player;

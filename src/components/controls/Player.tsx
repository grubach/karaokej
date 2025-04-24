import { useEffect } from "react";
import { loadPlayer } from "../../utils/player";
import style from "./Player.module.css";

const Player = () => {
  useEffect(() => {
    loadPlayer();
  }, []);

  return (
    <div className={style.Player}>
      <div className={style.video}>
        <div className={style.iframe} id="video-player"></div>
      </div>
    </div>
  );
};
export default Player;

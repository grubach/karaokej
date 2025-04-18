import { useEffect } from "react";
import { loadPlayer } from "../utils/player";
import style from "./Player.module.css";

const Player = () => {
  useEffect(() => {
    loadPlayer();
  }, []);

  return <div className={style.Player} id="video-player"></div>;
};
export default Player;

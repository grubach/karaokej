import { useEffect } from "react";
import { loadPlayer } from "../utils/player";
import style from "./Player.module.css";
import { Song } from "../utils/song";
import { loadSong } from "../utils/game";

type Props = {
  song: Song;
};

const Player = ({ song }: Props) => {
  useEffect(() => {
    loadPlayer();
  }, []);

  useEffect(() => {
    loadSong(song);
  }, [song]);

  return <div className={style.Player} id="video-player"></div>;
};
export default Player;

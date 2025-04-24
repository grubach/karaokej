import useStoreState from "../../hooks/useStoreState";
import { SongScored } from "../../songs";
import { appStore } from "../../utils/app";
import { loadSong } from "../../utils/game";
import { parseSongScored } from "../../utils/song";
import style from "./SongList.module.css";
import c from "classnames";

type Props = {
  songScored: SongScored;
};

const SongItem = ({ songScored }: Props) => {
  const { song } = useStoreState(appStore);
  const handleClick = () => {
    loadSong(parseSongScored(songScored));
  };

  const selected = song?.id === songScored.id;

  return (
    <div
      className={c(style.item, {
        [style.selected]: selected,
      })}
      onClick={handleClick}
    >
      <img
        className={style.cover}
        src={`https://img.youtube.com/vi/${songScored.karaokeVideo}/0.jpg`}
        alt={songScored.title}
      />
      <div className={style.info}>
        <div className={style.title}>{songScored.title}</div>
        <div className={style.artist}>{songScored.artist}</div>
      </div>
    </div>
  );
};
export default SongItem;

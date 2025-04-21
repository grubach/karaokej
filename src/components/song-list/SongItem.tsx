import { SongScored } from "../../songs";
import { parseSongScored, Song } from "../../utils/song";
import style from "./SongList.module.css";
import c from "classnames";

type Props = {
  song: SongScored;
  onSelect: (song: Song) => void;
  selected: boolean;
};

const SongItem = ({ song, onSelect, selected }: Props) => {
  const handleClick = () => {
    onSelect(parseSongScored(song));
  };
  return (
    <div
      className={c(style.item, {
        [style.selected]: selected,
      })}
      onClick={handleClick}
    >
      <img
        className={style.cover}
        src={`https://img.youtube.com/vi/${song.karaokeVideo}/0.jpg`}
        alt={song.title}
      />
      <div className={style.info}>
        <div className={style.title}>{song.title}</div>
        <div className={style.artist}>{song.artist}</div>
      </div>
    </div>
  );
};
export default SongItem;

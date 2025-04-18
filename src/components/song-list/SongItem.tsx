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
      {song.artist} - {song.title}
    </div>
  );
};
export default SongItem;

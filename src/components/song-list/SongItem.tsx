import { Song } from "../../utils/song";
import style from "./SongList.module.css";
import c from "classnames";

type Props = {
  song: Song;
  onSelect: (song: Song) => void;
  selected: boolean;
};

const SongItem = ({ song, onSelect, selected }: Props) => {
  const handleClick = () => {
    onSelect(song);
  };
  return (
    <div
      className={c(style.item, {
        [style.selected]: selected,
      })}
      onClick={handleClick}
    >
      {song.name}
    </div>
  );
};
export default SongItem;

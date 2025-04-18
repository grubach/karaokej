import { Song } from "../../utils/song";
import style from "./SongItem.module.css";
import c from "classnames";

type Props = {
  song: Song;
  onSelect: (song: Song) => void;
  isSelected: boolean;
};

const SongItem = ({ song, onSelect, isSelected }: Props) => {
  const handleClick = () => {
    onSelect(song);
  };
  return (
    <div
      className={c(style.SongItem, {
        [style.selected]: isSelected,
      })}
      onClick={handleClick}
    >
      {song.name}
    </div>
  );
};
export default SongItem;

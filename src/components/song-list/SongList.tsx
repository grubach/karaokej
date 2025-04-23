import { Song } from "../../utils/song";
import style from "./SongList.module.css";
import songs from "../../songs";
import SongItem from "./SongItem";
import HidePanel from "../parts/HidePanel";
import { FiList } from "react-icons/fi";
import { NOTE_HEIGHT } from "../../constants";

type Props = {
  currentSong?: Song;
  setCurrentSong: (song: Song) => void;
};

const SongList = ({ currentSong, setCurrentSong }: Props) => {
  return (
    <HidePanel
      className={style.SongList}
      direction="left"
      icon={
        <FiList
          size={1.5 * NOTE_HEIGHT}
          fill="currentColor"
          strokeWidth={2}
          stroke="currentColor"
        />
      }
    >
      {songs.map((song, index) => (
        <SongItem
          key={index}
          song={song}
          onSelect={setCurrentSong}
          selected={currentSong?.id === song.id}
        />
      ))}
    </HidePanel>
  );
};
export default SongList;

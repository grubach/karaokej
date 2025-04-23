import { Song } from "../../utils/song";
import style from "./SongList.module.css";
import songs from "../../songs";
import SongItem from "./SongItem";
import HidePanel from "../parts/HidePanel";
import { FiList } from "react-icons/fi";

type Props = {
  currentSong?: Song;
  setCurrentSong: (song: Song) => void;
};

const SongList = ({ currentSong, setCurrentSong }: Props) => {
  return (
    <HidePanel className={style.SongList} direction="left" icon={FiList}>
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

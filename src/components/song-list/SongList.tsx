import { Song } from "../../utils/song";
import style from "./SongList.module.css";
import songs from "../../songs";
import SongItem from "./SongItem";

type Props = {
  currentSong?: Song;
  setCurrentSong: (song: Song) => void;
};

const SongList = ({ currentSong, setCurrentSong }: Props) => {
  return (
    <div className={style.SongList}>
      {songs.map((song, index) => (
        <SongItem
          key={index}
          song={song}
          onSelect={setCurrentSong}
          selected={currentSong?.id === song.id}
        />
      ))}
    </div>
  );
};
export default SongList;

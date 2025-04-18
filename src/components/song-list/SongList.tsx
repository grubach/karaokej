import { Song } from "../../utils/song";
import style from "./SongList.module.css";
import { song1, song2 } from "../../utils/song";
import SongItem from "./SongItem";

const songs = [song1, song2];

type Props = {
  currentSong: Song;
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
          isSelected={currentSong.name === song.name}
        />
      ))}
    </div>
  );
};
export default SongList;

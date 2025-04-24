import style from "./SongList.module.css";
import songs from "../../songs";
import SongItem from "./SongItem";
import HidePanel from "../parts/HidePanel";
import { FiList } from "react-icons/fi";

const SongList = () => {
  return (
    <HidePanel className={style.SongList} direction="left" icon={FiList}>
      {songs.map((songScored) => (
        <SongItem key={songScored.id} songScored={songScored} />
      ))}
    </HidePanel>
  );
};
export default SongList;

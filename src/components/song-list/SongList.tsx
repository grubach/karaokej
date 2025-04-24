import style from "./SongList.module.css";
import songs from "../../songs";
import SongItem from "./SongItem";
import HidePanel from "../parts/HidePanel";
import { FiList } from "react-icons/fi";
import useStoreState from "../../hooks/useStoreState";
import { appStore } from "../../utils/app";

const SongList = () => {
  const { listOpen } = useStoreState(appStore);
  return (
    <HidePanel
      className={style.SongList}
      direction="left"
      icon={FiList}
      open={listOpen}
      onToggle={(value) => {
        appStore.updateValue((state) => ({
          ...state,
          listOpen: value,
        }));
      }}
    >
      {songs.map((songScored) => (
        <SongItem key={songScored.id} songScored={songScored} />
      ))}
    </HidePanel>
  );
};
export default SongList;

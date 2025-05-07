import useStoreState from "../../hooks/useStoreState";
import { SongScored } from "../../songs";
import { appStore } from "../../store/app";
import { gameStore } from "../../store/game";
import { loadGame, startGame } from "../../game";
import style from "./SongList.module.css";
import c from "classnames";

type Props = {
  songScored: SongScored;
};

const SongItem = ({ songScored }: Props) => {
  const { song } = useStoreState(appStore);
  const selected = song?.id === songScored.id;

  const handleClick = async () => {
    if (!selected) {
      gameStore.resetValue();
    }

    appStore.updateValue((state) => ({
      ...state,
      listOpen: false,
    }));

    loadGame(songScored);

    if (!selected) {
      await startGame();
    }
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
        src={`https://img.youtube.com/vi/${songScored.karaokeVideo}/0.jpg`}
        alt={songScored.title}
      />
      <div className={style.info}>
        <div className={style.title}>{songScored.title}</div>
        <div className={style.artist}>{songScored.artist}</div>
      </div>
    </div>
  );
};
export default SongItem;

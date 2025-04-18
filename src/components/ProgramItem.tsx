import { BEAT_WIDTH, NOTE_HEIGHT } from "../constants";
import style from "./ProgramItem.module.css";
import { SongItem } from "../utils/song";

type Props = {
  songItem: SongItem;
};

const ProgramItem = ({ songItem }: Props) => {
  const { text, duration, position, time } = songItem;
  return (
    <div
      className={style.ProgramItem}
      style={{
        width: `${duration * BEAT_WIDTH}px`,
        left: `${time * BEAT_WIDTH}px`,
        top: `${(-position * NOTE_HEIGHT) / 2}px`,
      }}
    >
      <span className={style.text}>{text}</span>
    </div>
  );
};
export default ProgramItem;

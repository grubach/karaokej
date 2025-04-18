import { BEAT_WIDTH, NOTE_HEIGHT } from "../constants";
import style from "./ProgramItem.module.css";
import { SongNote } from "../utils/song";

type Props = {
  songNote: SongNote;
};

const ProgramItem = ({ songNote }: Props) => {
  const { text, duration, pitch, time } = songNote;
  return (
    <div
      className={style.ProgramItem}
      style={{
        width: `${duration * BEAT_WIDTH}px`,
        left: `${time * BEAT_WIDTH}px`,
        top: `${(-pitch * NOTE_HEIGHT) / 2}px`,
      }}
    >
      <span className={style.text}>{text}</span>
    </div>
  );
};
export default ProgramItem;

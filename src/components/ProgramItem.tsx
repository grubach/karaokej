import { BEAT_WIDTH, NOTE_HEIGHT } from "../constants";
import style from "./ProgramItem.module.css";
import { Song, SongNote } from "../utils/song";
import useGameState from "../hooks/useGameState";
import { useRef } from "react";

type Props = {
  songNote: SongNote;
  song: Song;
};

const ProgramItem = ({ songNote, song }: Props) => {
  const shapeRef = useRef<HTMLDivElement>(null);
  const passedRef = useRef<HTMLDivElement>(null);
  const goodRef = useRef<HTMLDivElement>(null);

  const { id, text, duration, pitch, time } = songNote;

  useGameState(
    id,
    ([gameState]) => {
      if (!goodRef.current || !passedRef.current || !shapeRef.current) return;

      const { averageNoteScore } = gameState;
      if (averageNoteScore) {
        passedRef.current.style.opacity = "1";
        goodRef.current.style.opacity = averageNoteScore.toFixed(2);
        // shapeRef.current.style.transform = `scale(${
        //   1 + averageNoteScore * 0.25
        // })`;

        // requestAnimationFrame(() => {
        //   if (shapeRef.current) {
        //     shapeRef.current.style.transform = `scale(1)`;
        //   }
        // });
      }
    },
    []
  );

  const formattedText = text
    ?.replace(/_/g, " ") // Replace underscores with spaces
    .replace(/--/g, "-"); // replace double hyphens with single hyphen)

  return (
    <div
      className={style.ProgramItem}
      style={{
        width: `${duration * BEAT_WIDTH}px`,
        left: `${time * BEAT_WIDTH}px`,
        top: `${((song.averagePitch - pitch!) * NOTE_HEIGHT) / 2}px`,
      }}
    >
      <div className={style.shape} ref={shapeRef}>
        <div className={style.passed} ref={passedRef}></div>
        <div className={style.good} ref={goodRef}></div>
      </div>
      <span className={style.text}>{formattedText}</span>
    </div>
  );
};
export default ProgramItem;

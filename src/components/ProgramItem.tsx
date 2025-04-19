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
  const passedRef = useRef<HTMLDivElement>(null);
  const goodRef = useRef<HTMLDivElement>(null);

  const { index, text, duration, pitch, time } = songNote;

  useGameState(
    ([gameState]) => {
      if (
        !gameState ||
        gameState.noteIndex !== index ||
        !goodRef.current ||
        !passedRef.current
      )
        return;

      const { averageNoteScore } = gameState;
      if (averageNoteScore) {
        passedRef.current.style.opacity = "1";
        goodRef.current.style.opacity = averageNoteScore.toFixed(2);
      }
    },
    [index]
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
      <div className={style.passed} ref={passedRef}></div>
      <div className={style.good} ref={goodRef}></div>
      <span className={style.text}>{formattedText}</span>
    </div>
  );
};
export default ProgramItem;

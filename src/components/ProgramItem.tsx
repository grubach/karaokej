import { BEAT_WIDTH, NOTE_HEIGHT, NOTE_SCORE_RANGE } from "../constants";
import style from "./ProgramItem.module.css";
import { Song, SongNote } from "../utils/song";
import useStore from "../hooks/useStore";
import { useRef } from "react";
import cx from "classnames";
import { gameStore } from "../utils/game";

type Props = {
  songNote: SongNote;
  song: Song;
};

const pointsThreshold = 1 / NOTE_SCORE_RANGE;

const ProgramItem = ({ songNote, song }: Props) => {
  const shapeRef = useRef<HTMLDivElement>(null);
  const passedRef = useRef<HTMLDivElement>(null);
  const goodRef = useRef<HTMLDivElement>(null);

  const { id, text, duration, pitch, time, modifier } = songNote;

  useStore(
    gameStore,
    id,
    ([gameState]) => {
      if (!goodRef.current || !passedRef.current || !shapeRef.current) return;

      const { averageNoteScore } = gameState;
      if (averageNoteScore) {
        passedRef.current.style.opacity = "1";
        const passedScore =
          averageNoteScore > pointsThreshold
            ? (averageNoteScore - pointsThreshold) / (1 - pointsThreshold)
            : 0;
        goodRef.current.style.opacity = passedScore.toFixed(2);
        shapeRef.current.style.transform = `scale(${
          1 + (passedScore * 0.25) / duration
        }, ${1 + passedScore * 0.25})`;

        requestAnimationFrame(() => {
          if (shapeRef.current) {
            shapeRef.current.style.transform = "";
          }
        });
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
      <span
        className={cx(style.text, {
          [style.narrow]: modifier === "narrow",
        })}
      >
        {formattedText}
      </span>
    </div>
  );
};
export default ProgramItem;

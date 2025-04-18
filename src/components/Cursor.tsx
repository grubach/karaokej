import style from "./Cursor.module.css";
import { useRef } from "react";
import { BEAT_WIDTH, DETECTIONS_PER_SECOND, NOTE_HEIGHT } from "../constants";
import useGameState from "../hooks/useGameState";
import { timeToBeats } from "../utils/time";
import { Song } from "../utils/song";

type Props = {
  historyIndex: number;
  song: Song;
};

const Cursor = ({ historyIndex, song }: Props) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const goodRef = useRef<HTMLDivElement>(null);

  const { averagePitch, bpm } = song;

  const left =
    -timeToBeats(historyIndex * DETECTIONS_PER_SECOND, bpm) * BEAT_WIDTH;
  const top = (averagePitch * NOTE_HEIGHT) / 2;

  useGameState(
    (gameHistory) => {
      if (!cursorRef.current || !goodRef.current) return;

      const gameState = gameHistory[historyIndex];
      const { points, detectedPitch, lastPitch, transpose } = gameState;
      const anyPitch = detectedPitch ?? lastPitch;
      const pitch = anyPitch ? anyPitch + transpose * 12 : null;

      if (pitch === null) {
        cursorRef.current.style.opacity = "0";
        } else if (detectedPitch === null) {
          cursorRef.current.style.opacity = ".5";
      } else {
        cursorRef.current.style.opacity = "1";
        cursorRef.current.style.transform = `translateY(${(
          -(pitch * NOTE_HEIGHT) / 2
        ).toFixed(2)}px)

        `;
      }

      goodRef.current.style.opacity = points.toFixed(2);
    },
    [goodRef, cursorRef, historyIndex]
  );

  return (
    <div className={style.Cursor}>
      <div
        className={style.ball}
        ref={cursorRef}
        style={{ left: `${left}px`, top: `${top}px` }}
      >
        <div className={style.good} ref={goodRef}></div>
      </div>
    </div>
  );
};
export default Cursor;

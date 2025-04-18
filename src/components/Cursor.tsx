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

  const left =
    -timeToBeats(historyIndex * DETECTIONS_PER_SECOND, song.bpm) * BEAT_WIDTH;

  useGameState(
    (gameHistory) => {
      if (!cursorRef.current || !goodRef.current) return;

      const gameState = gameHistory[historyIndex];
      const { points, detectedPitch, transpose } = gameState;
      const pitch = detectedPitch ? detectedPitch + transpose : null;

      if (pitch === null) {
        cursorRef.current.style.opacity = "0";
      } else {
        cursorRef.current.style.opacity = "1";
        cursorRef.current.style.transform = `translateY(${(
          -(pitch * NOTE_HEIGHT) / 2
        ).toFixed(2)}px)

        `;
      }

      goodRef.current.style.opacity = points .toFixed(2);
    },
    [goodRef, cursorRef, historyIndex]
  );

  return (
    <div className={style.Cursor} ref={cursorRef} style={{ left: `${left}px` }}>
      <div className={style.good} ref={goodRef}></div>
    </div>
  );
};
export default Cursor;

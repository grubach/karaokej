import style from "./Cursor.module.css";
import { useRef } from "react";
import {
  BEAT_WIDTH,
  DETECTIONS_PER_SECOND,
  NOTE_HEIGHT,
  LATENCY,
} from "../constants";
import useGameState from "../hooks/useGameState";
import { timeToBeats } from "../utils/time";
import { Song } from "../utils/song";
import { clamp } from "../utils/tools";

type Props = {
  historyIndex: number;
  tailIndex: number;
  song: Song;
};

const Cursor = ({ historyIndex, tailIndex, song }: Props) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<number>(0);

  const { averagePitch, bpm } = song;

  const left = -timeToBeats(LATENCY, bpm) * BEAT_WIDTH;

  const scale = tailIndex === 0 ? 1 : (0.5 * (10 - tailIndex)) / 10;

  useGameState(
    (gameHistory) => {
      if (!cursorRef.current) return;

      const gameState = gameHistory[historyIndex];
      const { detectedPitch, lastPitch, transpose } = gameState;
      const anyPitch = detectedPitch ?? lastPitch;
      const pitch = anyPitch ? anyPitch + transpose * 12 : averagePitch;

      const diff = pitch - positionRef.current;
      positionRef.current += clamp(diff, -3, 3);

      let y = ((averagePitch - positionRef.current) * NOTE_HEIGHT) / 2;
      const x =
        -timeToBeats((historyIndex * 1000) / DETECTIONS_PER_SECOND, bpm) *
        BEAT_WIDTH;

      if (!detectedPitch) {
        y +=
          (Math.sin(timeToBeats(gameState.elapsed, bpm) * Math.PI) *
            NOTE_HEIGHT) /
          4;
      }

      cursorRef.current.style.transform = `translate(${x}px, ${y}px)`;
    },
    [cursorRef, positionRef, historyIndex, bpm, averagePitch, tailIndex]
  );

  return (
    <div
      className={style.Cursor}
      style={{
        zIndex: 10 - tailIndex,
      }}
    >
      <div
        className={style.movable}
        style={{ left: `${left}px` }}
        ref={cursorRef}
      >
        <div
          className={style.ball}
          style={{
            transform: `scale(${scale})`,
          }}
        ></div>
      </div>
    </div>
  );
};
export default Cursor;

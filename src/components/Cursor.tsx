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
  const top = (averagePitch * NOTE_HEIGHT) / 2;

  const scale = tailIndex === 0 ? 1 : (0.5 * (10 - tailIndex)) / 10;

  useGameState(
    (gameHistory) => {
      if (!cursorRef.current) return;

      const gameState = gameHistory[historyIndex];
      const { detectedPitch, lastPitch, transpose } = gameState;
      const anyPitch = detectedPitch ?? lastPitch;
      const pitch = anyPitch ? anyPitch + transpose * 12 : null;

      if (!pitch) return;

      const diff = pitch - positionRef.current;
      positionRef.current += clamp(diff, -1, 1);

      let y = -(positionRef.current * NOTE_HEIGHT) / 2;
      const x =
        -timeToBeats((historyIndex * 1000) / DETECTIONS_PER_SECOND, bpm) *
        BEAT_WIDTH;

      if (!detectedPitch) {
        y +=
          (Math.sin(timeToBeats(gameState.elapsed, bpm) * 4) * NOTE_HEIGHT) / 4;
      }

      cursorRef.current.style.transform = `translate(${x}px, ${y}px)`;
    },
    [cursorRef, positionRef, historyIndex, bpm, tailIndex]
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
        style={{ left: `${left}px`, top: `${top}px` }}
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

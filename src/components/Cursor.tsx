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
  const accentRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<number>(0);

  const { averagePitch, bpm, startTime } = song;

  const left = -timeToBeats(LATENCY, bpm) * BEAT_WIDTH;

  const scale = tailIndex === 0 ? 1 : (0.5 * (10 - tailIndex)) / 10;

  useGameState(
    "cursor",
    (gameHistory) => {
      if (!cursorRef.current || !accentRef.current) return;

      const gameState = gameHistory[historyIndex];

      const { detectedPitch, lastPitch, transpose, elapsed } = gameState;
      const anyPitch = detectedPitch ?? lastPitch;
      const pitch = anyPitch ? anyPitch + transpose * 12 : averagePitch;

      const diff = pitch - positionRef.current;
      positionRef.current += clamp(diff, -3, 3);

      const phase = timeToBeats(elapsed - startTime, bpm) % 2;
      const sin = Math.sin(phase * Math.PI) * 2;
      const sinusoidalMovement = detectedPitch
        ? 0
        : (Math.round(sin) * NOTE_HEIGHT) / 8;

      const y =
        ((averagePitch - positionRef.current) * NOTE_HEIGHT) / 2 +
        sinusoidalMovement;

      const x =
        left -
        timeToBeats(historyIndex / DETECTIONS_PER_SECOND, bpm) * BEAT_WIDTH;

      cursorRef.current.style.transform = `translate(${x.toFixed(
        2
      )}px, ${y.toFixed(2)}px)`;
      accentRef.current.style.opacity = transpose % 2 === 0 ? "0" : "1";
    },
    [
      cursorRef,
      positionRef,
      historyIndex,
      bpm,
      averagePitch,
      tailIndex,
      left,
      startTime,
    ]
  );

  return (
    <div
      className={style.Cursor}
      style={{
        zIndex: 10 - tailIndex,
      }}
    >
      <div className={style.movable} ref={cursorRef}>
        <div
          className={style.ball}
          style={{
            transform: `scale(${scale})`,
          }}
        >
          <div className={style.accent} ref={accentRef}></div>
        </div>
      </div>
    </div>
  );
};
export default Cursor;

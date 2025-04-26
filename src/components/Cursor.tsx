import style from "./Cursor.module.css";
import { useRef, useState } from "react";
import {
  BEAT_WIDTH,
  DETECTIONS_PER_SECOND,
  NOTE_HEIGHT,
  LATENCY,
} from "../constants";
import useStore from "../hooks/useStore";
import { timeToBeats } from "../utils/time";
import { clamp } from "../utils/tools";
import { gameStore } from "../utils/game";
import useStoreState from "../hooks/useStoreState";
import { appStore } from "../utils/app";
import cx from "classnames";

type Props = {
  historyIndex: number;
  tailIndex: number;
};

const octaveShift = (12 * NOTE_HEIGHT) / 2;
const octaves = Array.from({ length: 4 }, (_, i) => i );

const Cursor = ({ historyIndex, tailIndex }: Props) => {
  const [transpose, setTranspose] = useState<number>(0);
  const { song, speed } = useStoreState(appStore);
  const cursorRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<number>(0);

  const { averagePitch, bpm, startTime } = song;

  const left = -timeToBeats(LATENCY, bpm) * speed * BEAT_WIDTH;

  const scale = tailIndex === 0 ? 1 : (0.5 * (10 - tailIndex)) / 10;

  useStore(
    gameStore,
    "default",
    (gameHistory) => {
      if (!cursorRef.current) return;

      const gameState = gameHistory[historyIndex];

      const { detectedPitch, lastPitch, transpose, elapsed } = gameState;
      const anyPitch = detectedPitch ?? lastPitch;
      const pitch = anyPitch ? anyPitch + 2 * 12 : averagePitch;

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
      setTranspose(transpose);
      // accentRef.current.style.opacity = transpose % 2 === 0 ? "0" : "1";
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
        {octaves.map((octave) => (
          <div
            className={cx(style.ball, { [style.accent]: octave % 2 === 1 })}
            style={{
              top: `${octaveShift * (2-octave)}px`,
              transform: `scale(${scale})`,
              opacity: octave === transpose ? 1 : 0,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};
export default Cursor;

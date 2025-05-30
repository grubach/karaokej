import style from "./Cursor.module.css";
import { useRef, useState } from "react";
import {
  BEAT_WIDTH,
  DETECTIONS_PER_SECOND,
  NOTE_HEIGHT,
  LATENCY,
} from "../constants";
import useStore from "../hooks/useStore";
import { beatsToTime, timeToBeats } from "../utils/time";
import { gameStore } from "../store/game";
import useStoreState from "../hooks/useStoreState";
import { appStore } from "../store/app";
import cx from "classnames";

type Props = {
  historyIndex: number;
  tailIndex: number;
};

const octaveShift = (12 * NOTE_HEIGHT) / 2;

const Cursor = ({ historyIndex, tailIndex }: Props) => {
  const [currentTranspose, setCurrentTranspose] = useState<number>(0);
  const transposeRef = useRef<number>(-1);

  const { song, speed, averagePitch, gameMode } = useStoreState(appStore);
  const cursorRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<number>(0);

  const { bpm, startTime } = song;

  const left =
    gameMode === "sing" ? -timeToBeats(LATENCY, bpm) * speed * BEAT_WIDTH : 0;

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
      const bigDiff = Math.abs(diff) > 11;
      positionRef.current += diff;

      const phase = timeToBeats(elapsed - startTime, bpm) % 2;
      const sin = phase < 1 ? -1 : 1;
      const rest = detectedPitch === null;
      const sinusoidalMovement = rest ? (sin * NOTE_HEIGHT) / 2 : 0;
      const beatTime = beatsToTime(1, bpm);

      const y =
        ((averagePitch - positionRef.current) * NOTE_HEIGHT) / 2 +
        sinusoidalMovement;

      const x =
        left -
        timeToBeats(historyIndex / DETECTIONS_PER_SECOND, bpm) * BEAT_WIDTH;

      if (transposeRef.current !== transpose) {
        transposeRef.current = transpose;
        setCurrentTranspose(transpose);
      }

      cursorRef.current.style.transform = `translate(${x.toFixed(
        2
      )}px, ${y.toFixed(2)}px)`;
      cursorRef.current.style.transitionDuration = bigDiff
        ? "0s"
        : rest
        ? `${beatTime}s`
        : "";
    },
    [
      cursorRef,
      positionRef,
      transposeRef,
      historyIndex,
      bpm,
      averagePitch,
      tailIndex,
      left,
      startTime,
      setCurrentTranspose,
    ]
  );

  return (
    <div className={style.Cursor}>
      <div className={style.movable} ref={cursorRef}>
        <div
          className={cx(style.ball, {
            [style.accent]: true,
          })}
          style={{
            top: `${(NOTE_HEIGHT * (1 - scale)) / 2 - octaveShift}px`,
            width: `${NOTE_HEIGHT * scale}px`,
            height: `${NOTE_HEIGHT * scale}px`,
            opacity: currentTranspose === 3 ? 1 : 0,
          }}
        ></div>
        <div
          className={cx(style.ball, {
            [style.accent]: false,
          })}
          style={{
            top: `${(NOTE_HEIGHT * (1 - scale)) / 2}px`,
            width: `${NOTE_HEIGHT * scale}px`,
            height: `${NOTE_HEIGHT * scale}px`,
            opacity: currentTranspose === 2 ? 1 : 0,
          }}
        ></div>
        <div
          className={cx(style.ball, {
            [style.accent]: true,
          })}
          style={{
            top: `${(NOTE_HEIGHT * (1 - scale)) / 2 + octaveShift}px`,
            width: `${NOTE_HEIGHT * scale}px`,
            height: `${NOTE_HEIGHT * scale}px`,
            opacity: currentTranspose === 1 ? 1 : 0,
          }}
        ></div>
        <div
          className={cx(style.ball, {
            [style.accent]: false,
          })}
          style={{
            top: `${(NOTE_HEIGHT * (1 - scale)) / 2 + 2 * octaveShift}px`,
            width: `${NOTE_HEIGHT * scale}px`,
            height: `${NOTE_HEIGHT * scale}px`,
            opacity: currentTranspose === 0 ? 1 : 0,
          }}
        ></div>
      </div>
    </div>
  );
};
export default Cursor;

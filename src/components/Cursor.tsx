import style from "./Cursor.module.css";
import { useRef, useState } from "react";
import {
  BEAT_WIDTH,
  DETECTIONS_PER_SECOND,
  NOTE_HEIGHT,
  LATENCY,
} from "../constants";
import useGameState from "../hooks/useGameState";
import { timeToBeats } from "../utils/time";
import { Song } from "../utils/song";

type Props = {
  historyIndex: number;
  song: Song;
};

const octaveShift = (12 * NOTE_HEIGHT) / 2;

const Cursor = ({ historyIndex, song }: Props) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [octave, setOctave] = useState(0);

  const { averagePitch, bpm } = song;

  const left =
    -timeToBeats(historyIndex * DETECTIONS_PER_SECOND + LATENCY, bpm) *
    BEAT_WIDTH;
  const top = (averagePitch * NOTE_HEIGHT) / 2;

  useGameState(
    (gameHistory) => {
      if (!cursorRef.current) return;

      const gameState = gameHistory[historyIndex];
      const { detectedPitch, lastPitch, transpose } = gameState;
      const anyPitch = detectedPitch ?? lastPitch;
      const pitch = anyPitch; //? anyPitch + transpose * 12 : null;

      if (transpose !== octave) {
        setOctave(transpose);
      }

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
    },
    [cursorRef, historyIndex, octave]
  );

  return (
    <div className={style.Cursor}>
      <div
        className={style.movable}
        ref={cursorRef}
        style={{ left: `${left}px`, top: `${top}px` }}
      >
        <div
          className={style.ball}
          style={{
            opacity: octave === 0 ? 1 : 0,
          }}
        ></div>
        <div
          className={style.ball}
          style={{
            top: `${-octaveShift}px`,
            opacity: octave === 1 ? 1 : 0,
          }}
        ></div>
        <div
          className={style.ball}
          style={{
            top: `${-octaveShift * 2}px`,
            opacity: octave === 2 ? 1 : 0,
          }}
        ></div>
        <div
          className={style.ball}
          style={{
            top: `${-octaveShift * 3}px`,
            opacity: octave === 3 ? 1 : 0,
          }}
        ></div>
      </div>
    </div>
  );
};
export default Cursor;

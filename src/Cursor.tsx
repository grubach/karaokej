import style from "./Cursor.module.css";
import { useRef } from "react";
import {
  BEAT_WIDTH,
  CURSOR_TAIL,
  DETECTIONS_PER_SECOND,
  NOTE_HEIGHT,
} from "./constants";
import useGameState from "./hooks/useGameState";
import { timeToBeats } from "./utils/time";
import { song } from "./utils/song";
import { distortion, noise } from "./utils/tools";

type Props = {
  historyIndex: number;
};

const Cursor = ({ historyIndex }: Props) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const goodRef = useRef<HTMLDivElement>(null);

  const left =
    -timeToBeats(historyIndex * DETECTIONS_PER_SECOND, song.bpm) * BEAT_WIDTH;
  const tailFactor = historyIndex / CURSOR_TAIL;
  const scale = 1 + tailFactor ** 2 * 2;

  useGameState(
    (gameHistory) => {
      if (!cursorRef.current || !goodRef.current) return;

      const gameState = gameHistory[historyIndex];
      const { points, detectedPitch, transpose } = gameState;
      const pitch = detectedPitch ? detectedPitch + transpose : null;
      const opacity = historyIndex === 0 ? 1 : (1 - tailFactor) * 0.5 * points;

      if (pitch === null) {
        cursorRef.current.style.opacity = "0";
      } else {
        cursorRef.current.style.opacity = opacity.toFixed(2);
        cursorRef.current.style.transform = `translateY(${(
          -((pitch + noise(5 * tailFactor)) * NOTE_HEIGHT) / 2
        ).toFixed(2)}px)
        scale(${distortion(scale, 1 * tailFactor).toFixed(2)})
        `;
      }

      goodRef.current.style.opacity = points.toFixed(2);
    },
    [goodRef, cursorRef, historyIndex, tailFactor]
  );

  return (
    <div className={style.Cursor} ref={cursorRef} style={{ left: `${left}px` }}>
      <div className={style.good} ref={goodRef}></div>
    </div>
  );
};
export default Cursor;

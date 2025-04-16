import style from "./Cursor.module.css";
import { useRef } from "react";
import { NOTE_HEIGHT } from "./constants";
import useGameState from "./hooks/useGameState";

type Props = {};

const Cursor = ({}: Props) => {
  const valueRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  useGameState(
    (gameState) => {
      const value = gameState.detectedPitch
        ? gameState.detectedPitch + gameState.transpose
        : null;

      if (!cursorRef.current) return;
      if (value === null) {
        cursorRef.current.style.opacity = "0";
      } else {
        cursorRef.current.style.opacity = "1";
        cursorRef.current.style.transform = `translateY(${(
          (-value * NOTE_HEIGHT) /
          2
        ).toFixed(2)}px)`;
      }
    },
    [valueRef, cursorRef]
  );

  return <div className={style.Cursor} ref={cursorRef}></div>;
};
export default Cursor;

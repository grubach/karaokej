import { PropsWithChildren, useRef } from "react";
import style from "./Track.module.css";
import useGameState from "../hooks/useGameState";
import { Song } from "../utils/song";
import { timeToBeats } from "../utils/time";
import { NOTE_HEIGHT } from "../constants";

type Props = {
  song: Song;
};

const Track = ({ children, song }: PropsWithChildren<Props>) => {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const { notes, startTime, endTime, bpm } = song;

  useGameState(
    "program",
    ([{ elapsed }]) => {
      if (!backgroundRef.current) return;
      const beatsPassed = timeToBeats(elapsed, bpm);
      const translate = (beatsPassed % 12)/12 * NOTE_HEIGHT*12;
      backgroundRef.current.style.transform = `translateX(${-translate}px)`;
    },
    [backgroundRef, notes, startTime, endTime, bpm]
  );

  return <div className={style.Track}>
    <div className={style.background}
    ref={backgroundRef}
    ></div>
    <div className={style.line}></div>
    {children}
    </div>;
};
export default Track;

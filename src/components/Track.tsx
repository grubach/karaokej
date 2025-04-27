import { PropsWithChildren, useRef } from "react";
import style from "./Track.module.css";
import { timeToBeats } from "../utils/time";
import { NOTE_HEIGHT } from "../constants";
import useStore from "../hooks/useStore";
import useStoreState from "../hooks/useStoreState";
import { appStore } from "../store/app";
import { gameStore } from "../store/game";

const Track = ({ children }: PropsWithChildren) => {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const { song } = useStoreState(appStore);
  const { notes, startTime, endTime, bpm } = song;

  useStore(
    gameStore,
    "default",
    ([{ elapsed }]) => {
      if (!backgroundRef.current) return;
      const beatsPassed = timeToBeats(elapsed, bpm);
      const translate = ((beatsPassed % 12) / 12) * NOTE_HEIGHT * 12;
      backgroundRef.current.style.transform = `translateX(${-translate}px)`;
    },
    [backgroundRef, notes, startTime, endTime, bpm]
  );

  return (
    <div className={style.Track}>
      <div className={style.background} ref={backgroundRef}></div>
      <div className={style.line}></div>
      {children}
    </div>
  );
};
export default Track;

import { useRef } from "react";
import { BEAT_WIDTH } from "../constants";
import style from "./Program.module.css";
import ProgramItem from "./ProgramItem";
import { timeToBeats } from "../utils/time";
import useStore from "../hooks/useStore";
import { gameStore } from "../utils/game";
import useStoreState from "../hooks/useStoreState";
import { appStore } from "../utils/app";


const Program = () => {
  const { song } = useStoreState(appStore);
  const notesRef = useRef<HTMLDivElement>(null);
  const { notes, startTime, endTime, bpm } = song;
  const left = timeToBeats(startTime, bpm) * BEAT_WIDTH;
  useStore(
    gameStore,
    "default",
    ([{ elapsed }]) => {
      if (!notesRef.current) return;
      const beatsPassed = timeToBeats(elapsed, bpm);
      const translate = beatsPassed * BEAT_WIDTH;
      notesRef.current.style.transform = `translateX(${left - translate}px)`;
    },
    [notesRef, notes, startTime, endTime, bpm, left]
  );

  return (
    <div className={style.Program}>
      <div ref={notesRef} className={style.notes}>
        {notes
          .filter((note) => note.pitch !== null)
          .map((note) => (
            <ProgramItem key={note.id} songNote={note} song={song} />
          ))}
      </div>
    </div>
  );
};
export default Program;

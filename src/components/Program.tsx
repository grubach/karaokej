import { useRef } from "react";
import { BEAT_WIDTH } from "../constants";
import style from "./Program.module.css";
import ProgramItem from "./ProgramItem";
import { Song } from "../utils/song";
import { timeToBeats } from "../utils/time";
import useGameState from "../hooks/useGameState";

type Props = {
  song: Song;
};

const Program = ({ song }: Props) => {
  const notesRef = useRef<HTMLDivElement>(null);
  const { notes, startTime, endTime, bpm } = song;
  useGameState(
    ([{ elapsed }]) => {
      if (!notesRef.current) return;
      const beatsPassed = timeToBeats(elapsed, bpm);
      const translate = beatsPassed * BEAT_WIDTH;
      notesRef.current.style.transform = `translateX(${-translate}px)`;
    },
    [notesRef, notes, startTime, endTime, bpm]
  );

  const left = timeToBeats(startTime, bpm) * BEAT_WIDTH;

  return (
    <div className={style.Program}>
      <div
        ref={notesRef}
        className={style.notes}
        style={{
          left: `${left}px`,
        }}
      >
        {notes.map((note, index) => (
          <ProgramItem key={index} songItem={note} />
        ))}
      </div>
    </div>
  );
};
export default Program;

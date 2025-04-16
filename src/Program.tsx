import { useRef } from "react";
import { BEAT_WIDTH } from "./constants";
import useFrameLoop from "./hooks/useFrameLoop";
import style from "./Program.module.css";
import ProgramItem from "./ProgramItem";
import { Song } from "./utils/song";

type Props = {
  song: Song;
};

const Program = ({ song }: Props) => {
  const notesRef = useRef<HTMLDivElement>(null);
  const { notes, startTime, endTime, bpm } = song;
  const left = 0; //((startTime * (bpm / 4)) / 60000) * BEAT_WIDTH;
  useFrameLoop((time) => {
    if (!notesRef.current) return;

    const currentTime = (time % endTime) - startTime;
    const beatsPassed = (currentTime * (bpm / 4)) / 60000;
    const translate = beatsPassed * BEAT_WIDTH;
    notesRef.current.style.transform = `translateX(${-translate}px)`;
  });
  return (
    <div className={style.Program}>
      <div ref={notesRef} className={style.notes}>
        {notes.map((note, index) => (
          <ProgramItem key={index} songItem={note} />
        ))}
      </div>
    </div>
  );
};
export default Program;

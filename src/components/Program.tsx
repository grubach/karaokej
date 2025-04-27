import { useRef, useState } from "react";
import { BEAT_WIDTH } from "../constants";
import style from "./Program.module.css";
import ProgramItem from "./ProgramItem";
import { timeToBeats } from "../utils/time";
import useStore from "../hooks/useStore";
import { gameStore } from "../store/game";
import useStoreState from "../hooks/useStoreState";
import { appStore } from "../store/app";
import { SongNote } from "../utils/song";

const stringifyNotes = (notes: SongNote[]) =>
  notes.map((note) => note.id).join(",");

const Program = () => {
  const [currentNotes, setCurrentNotes] = useState<SongNote[]>([]);
  const currentNotesRef = useRef<SongNote[]>([]);
  const { song } = useStoreState(appStore);
  const notesRef = useRef<HTMLDivElement>(null);
  const { notes, startTime, endTime, bpm } = song;
  const left = timeToBeats(startTime, bpm) * BEAT_WIDTH;
  useStore(
    gameStore,
    "default",
    ([{ elapsed }]) => {
      if (!notesRef.current || !currentNotesRef.current) return;

      const elapsedBeats = timeToBeats(elapsed, bpm);
      const currentNotes = notes
        .filter((note) => note.pitch !== null)
        .filter(
          (note) =>
            (note.time + note.duration - elapsedBeats) * BEAT_WIDTH + left >
              -window.innerWidth * 0.5 &&
            (note.time - elapsedBeats) * BEAT_WIDTH + left <
              window.innerWidth * 0.5
        )
        .reverse();

      if (
        stringifyNotes(currentNotesRef.current) !== stringifyNotes(currentNotes)
      ) {
        setCurrentNotes(currentNotes);
        currentNotesRef.current = currentNotes;
      }


    },
    [notesRef, currentNotesRef, notes, startTime, endTime, bpm, left]
  );

  return (
    <div className={style.Program}>
      <div ref={notesRef} className={style.notes}
      style= {{
        left: `${left}px`,
      }}
      >
        {currentNotes.map((note) => (
          <ProgramItem key={note.id} songNote={note} song={song} />
        ))}
      </div>
    </div>
  );
};
export default Program;

import { useRef } from "react";
import useGameState from "../hooks/useGameState";
import { Song } from "../utils/song";
import { beatsToTime } from "../utils/time";
import styles from "./Wait.module.css";

type Props = {
  song: Song;
};

const Wait = ({ song }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useGameState(
    "wait",
    ([gameState]) => {
      const { elapsed, currentSongNote } = gameState;
      if (!containerRef.current || !fillRef.current) return;
      if (
        !currentSongNote ||
        currentSongNote.pitch !== null ||
        currentSongNote.duration < 16
      ) {
        containerRef.current.style.opacity = "0";
        return;
      }
      containerRef.current.style.opacity = "1";

      const noteStartTime =
        song.startTime + beatsToTime(currentSongNote.time, song.bpm);
      const noteEndTime =
        noteStartTime + beatsToTime(currentSongNote.duration, song.bpm);
      const progress =
        (elapsed - noteStartTime) / (noteEndTime - noteStartTime);
      fillRef.current.style.transform = `scaleX(${progress})`;
    },
    [fillRef, song]
  );
  return (
    <div className={styles.Wait} ref={containerRef}>
      <div className={styles.fill} ref={fillRef}></div>
    </div>
  );
};

export default Wait;

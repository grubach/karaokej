import { useRef } from "react";
import { beatsToTime } from "../utils/time";
import styles from "./Wait.module.css";
import useStore from "../hooks/useStore";
import { gameStore } from "../store/game";
import { appStore } from "../store/app";
import useStoreState from "../hooks/useStoreState";

const Wait = () => {
  const { song } = useStoreState(appStore);
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useStore(
    gameStore,
    "default",
    ([gameState]) => {
      const { elapsed, currentSongNote } = gameState;
      if (!containerRef.current || !fillRef.current) return;
      if (
        !currentSongNote ||
        currentSongNote.pitch !== null ||
        currentSongNote.duration < 8
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

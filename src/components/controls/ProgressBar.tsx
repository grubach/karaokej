import { useRef, useState } from "react";
import useStore from "../../hooks/useStore";
import { gameStore } from "../../utils/game";
import styles from "./ProgressBar.module.css";
import { formatSeconds, roundTo } from "../../utils/tools";
import useStoreState from "../../hooks/useStoreState";
import { appStore } from "../../utils/app";
import { seekTo } from "../../utils/player";

const ProgressBar = () => {
  const [elapsed, setElapsed] = useState(0);
  const markerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const { song } = useStoreState(appStore);
  useStore(
    gameStore,
    null,
    ([gameState]) => {
      setElapsed(roundTo(gameState.elapsed, 0));

      if (!markerRef.current) return;
      const { endTime } = song;
      const progress = (gameState.elapsed * 100) / endTime;
      markerRef.current.style.transform = `translateX(${progress}%)`;
    },
    [song]
  );

  const handleSeek = (clientX: number) => {
    if (!barRef.current) return;
    const { left, width } = barRef.current.getBoundingClientRect();
    const offset = clientX - left;
    const progress = offset / width;
    const seekTime = song.startTime + progress * song.endTime;
    seekTo(seekTime);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons !== 1) return; 
    e.preventDefault();
    e.stopPropagation();
    handleSeek(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.touches[0]) return;
    handleSeek(e.touches[0].clientX);
  };

  return (
    <div className={styles.ProgressBar}>
      <div
        className={styles.bar}
        ref={barRef}
        onMouseDown={handleMouseMove}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchMove}
        onTouchMove={handleTouchMove}
      >
        <div className={styles.line} />
        <div className={styles.marker} ref={markerRef}>
          <div className={styles.ball} />
        </div>
      </div>
      <div className={styles.timers}>
        <span className={styles.currentTime}>{formatSeconds(elapsed)}</span>
        <span className={styles.duration}>{formatSeconds(song.endTime)}</span>
      </div>
    </div>
  );
};
export default ProgressBar;

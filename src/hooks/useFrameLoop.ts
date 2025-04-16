import { useEffect, useRef } from "react";

const useFrameLoop = (callback: FrameRequestCallback) => {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const raf = () => {
      callback(performance.now());
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [callback]);
};

export default useFrameLoop;

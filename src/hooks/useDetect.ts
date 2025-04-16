import { DependencyList, useCallback } from "react";
import useFrameLoop from "./useFrameLoop";
import { getHistory } from "../utils/detect";

type PositionListener = (history: (number | null)[]) => void;

const useDetect = (listener: PositionListener, deps: DependencyList) => {
  const onFrame = useCallback(() => {
    listener(getHistory());
  }, [listener, deps]);

  useFrameLoop(onFrame);
};

export default useDetect;

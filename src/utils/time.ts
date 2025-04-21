export const bpmToTime = (bpm: number) => {
  return (60 * 1000) / bpm;
};
export const timeToBpm = (time: number) => {
  return (60 * 1000) / time;
};

export const timeToBeats = (time: number, bpm: number) => {
  return time / timeToBpm(bpm);
};

export const beatsToTime = (beats: number, bpm: number) => {
  return beats * timeToBpm(bpm);
};

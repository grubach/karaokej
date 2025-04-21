export const bpmToTime = (bpm: number) => {
  return 60 / bpm;
};
export const timeToBpm = (time: number) => {
  return 60 / time;
};

export const timeToBeats = (time: number, bpm: number) => {
  return (time * bpm) / 60;
};

export const beatsToTime = (beats: number, bpm: number) => {
  return (beats * 60) / bpm;
};

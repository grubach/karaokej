export const bpmToTime = (bpm: number) => {
  return (60 / bpm) * 1000;
}
export const timeToBpm = (time: number) => {
  return (60 / time) * 1000;
}

export const timeToBeats = (time: number, bpm: number) => {
  return (time / bpmToTime(bpm));
}

export const beatsToTime = (beats: number, bpm: number) => {
  return (beats * bpmToTime(bpm));
}
export type SongItem = {
  time: number; // in seconds
  duration: number; // in beats
  position: number; // in semitones
  text: string; // text to display
};

export type Song = {
  name: string;
  bpm: number; // beats per minute
  startTime: number; // in milliseconds
  endTime: number; // in milliseconds
  notes: SongItem[];
};

export const song: Song = {
  name: "doremifasol",
  bpm: 120,
  startTime: 2000,
  endTime: 10000,
  notes: [
    {
      time: 0,
      duration: 0.5, // beats
      position: 0,
      text: "do",
    },
    {
      time: 0.5,
      duration: 0.5,
      position: 2,
      text: "re",
    },
    {
      time: 1,
      duration: 0.5,
      position: 4,
      text: "mi",
    },
    {
      time: 1.5,
      duration: 0.5,
      position: 5,
      text: "fa",
    },
    {
      time: 2,
      duration: 0.5,
      position: 7,
      text: "sol",
    },
    {
      time: 2.5,
      duration: 0.5,
      position: 9,
      text: "la",
    },
    {
      time: 3,
      duration: 0.5,
      position: 11,
      text: "si",
    },
    {
      time: 3.5,
      duration: 0.5,
      position: 12,
      text: "do",
    },
  ],
};

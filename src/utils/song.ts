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
  endTime: 11000,
  notes: [
    {
      time: 0,
      duration: 2, // beats
      position: 0,
      text: "do",
    },
    {
      time: 2,
      duration: 2,
      position: 2,
      text: "re",
    },
    {
      time: 4,
      duration: 2,
      position: 4,
      text: "mi",
    },
    {
      time: 6,
      duration: 2,
      position: 5,
      text: "fa",
    },
    {
      time: 8,
      duration: 2,
      position: 7,
      text: "sol",
    },
    {
      time: 10,
      duration: 2,
      position: 9,
      text: "la",
    },
    {
      time: 12,
      duration: 2,
      position: 11,
      text: "si",
    },
    {
      time: 14,
      duration: 2,
      position: 12,
      text: "do",
    },
  ],
};

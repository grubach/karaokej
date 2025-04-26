import { SongScored } from "../songs";

export type Modifier = "narrow";

export type SongNote = {
  id: string; // unique identifier
  index: number; // index of the note in the score
  time: number; // in seconds
  duration: number; // in beats
  pitch: number | null; // in semitones
  text: string; // text to display
  modifier: Modifier | null; // modifier to apply to the note
};

export type Song = {
  id: string; // unique identifier
  title: string;
  artist: string;
  video: string; // YouTube video ID
  bpm: number; // beats per minute
  startTime: number; // in seconds
  endTime: number; // in seconds
  averagePitch: number; // in semitones
  notes: SongNote[];
};

export const emptySong: Song = {
  id: "",
  title: "",
  artist: "",
  video: "",
  bpm: 0,
  startTime: 0,
  endTime: 0,
  averagePitch: 0,
  notes: [],
};


const scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const notesParser = (song: SongScored): SongNote[] => {
  const { score, id } = song;
  console.log("score", score);
  // split by whitespaces and remove empty strings
  const notes = score.split(/\s+/).filter((note) => note.trim() !== "");
  console.log("notes", notes);

  let cursor = 0;
  const parsedNotes: SongNote[] = [];
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const [noteName, durationName, text, modifier] = note.split(":");
    const [noteLetter, noteOctave] = noteName.split(/(?=[0-9])/);
    // A4 = 57
    // C4 = 48
    // C5 = 60
    const pitch =
      noteLetter === "P"
        ? null
        : scale.indexOf(noteLetter) + 12 * parseInt(noteOctave);
    const duration = parseFloat(durationName);
    const time = cursor;
    cursor += duration;
    parsedNotes.push({
      id: `${id}-${i}`,
      index: i,
      time,
      duration,
      pitch,
      text,
      modifier: (modifier ?? null) as Modifier | null,
    });
  }
  console.log("parsedNotes", parsedNotes);

  return parsedNotes;
};

export const parseSongScored = (songScored: SongScored): Song => {
  const { score, karaokeVideo, originalVideo, ...rest } = songScored;
  const parsedNotes = notesParser(songScored);
  console.log("parsedNotes", parsedNotes);
  const notesPitches = parsedNotes
    .filter((note) => note.pitch !== null)
    .map((note) => note.pitch!);
  const averagePitch =
    (Math.max(...notesPitches) + Math.min(...notesPitches)) / 2;
  console.log("averagePitch", averagePitch);

  return {
    ...rest,
    video: karaokeVideo,
    // video: originalVideo,
    averagePitch,
    notes: parsedNotes,
  };
};

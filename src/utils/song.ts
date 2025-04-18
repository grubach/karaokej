import { SongScored } from "../songs";

export type SongNote = {
  index: number; // index of the note in the score
  time: number; // in seconds
  duration: number; // in beats
  pitch: number | null; // in semitones
  text: string; // text to display
};

export type Song = {
  id: string; // unique identifier
  title: string;
  artist: string;
  video: string; // YouTube video ID
  bpm: number; // beats per minute
  startTime: number; // in milliseconds
  endTime: number; // in milliseconds
  averagePitch: number; // in semitones
  notes: SongNote[];
};

const scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const notesParser = (score: string): SongNote[] => {
  console.log("score", score);
  // split by whitespaces and remove empty strings
  const notes = score.split(/\s+/).filter((note) => note.trim() !== "");
  console.log("notes", notes);

  let cursor = 0;
  const parsedNotes: SongNote[] = [];
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const [noteName, durationName, text] = note.split(":");
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
      index: i,
      time,
      duration,
      pitch,
      text,
    });
  }
  console.log("parsedNotes", parsedNotes);

  return parsedNotes;
};

export const parseSongScored = (songScored: SongScored): Song => {
  const { score, ...rest } = songScored;
  const parsedNotes = notesParser(score);
  console.log("parsedNotes", parsedNotes);
  const averagePitch =
    parsedNotes
      .filter((note) => note.pitch !== null)
      .reduce((acc, note) => acc + note.pitch!, 0) / parsedNotes.length;
  console.log("averagePitch", averagePitch);

  return {
    ...rest,
    averagePitch,
    notes: parsedNotes,
  };
};

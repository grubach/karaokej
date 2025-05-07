import { SongScored } from "../songs";
import { appStore } from "../store/app";

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

const scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const notesParser = (song: SongScored): SongNote[] => {
  const { score, id } = song;

  // split by whitespaces and remove empty strings
  const notes = score.split(/\s+/).filter((note) => note.trim() !== "");

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
      id: `${id}-${i}-${note}`,
      index: i,
      time,
      duration,
      pitch,
      text,
      modifier: (modifier ?? null) as Modifier | null,
    });
  }

  return parsedNotes;
};

export const loadSongScored = (song: SongScored) => {
  const notes = notesParser(song);

  const notesPitches = notes
    .filter((note) => note.pitch !== null)
    .map((note) => note.pitch!);
  const averagePitch =
    (Math.max(...notesPitches) + Math.min(...notesPitches)) / 2;

  appStore.updateValue((state) => ({
    ...state,
    song,
    notes,
    averagePitch,
  }));
};

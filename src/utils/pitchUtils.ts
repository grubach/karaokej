import { SongScored } from "../songs";
import { SongNote } from "./song";
import { beatsToTime } from "./time";

/**
 * Calculates the octave transposition needed to compare two pitches
 * @param target - The target pitch to compare against
 * @param detectedPitch - The detected pitch from the microphone
 * @returns The number of octaves to transpose (positive or negative)
 */
export const findTranspose = (target: number, detectedPitch: number): number => {
  let transpose = 0;
  let diff = detectedPitch - target;
  while (Math.abs(diff) > 6) {
    if (diff > 0) {
      transpose -= 1;
    } else {
      transpose += 1;
    }
    diff = detectedPitch + transpose * 12 - target;
  }

  return transpose;
};

/**
 * Calculates the pitch difference between target and detected notes, accounting for octave transposition
 * @param target - The target pitch to compare against
 * @param detectedPitch - The detected pitch from the microphone
 * @returns The pitch difference in semitones
 */
export const findNearestDifference = (target: number, detectedPitch: number): number => {
  const transpose = findTranspose(target, detectedPitch);
  const diff = detectedPitch + transpose * 12 - target;
  return diff;
};

/**
 * Finds the nearest note at a given time in the song
 * @param song - The current song being played
 * @param notes - Array of notes in the song
 * @param elapsed - Current elapsed time in the song
 * @param pitch - Current detected pitch
 * @param tolerance - Time tolerance for note detection
 * @returns The nearest note at the given time, or null if no note is found
 */
export const getSongNoteAtTime = (
  song: SongScored,
  notes: SongNote[],
  elapsed: number,
  pitch: number,
  tolerance: number
): SongNote | null => {
  const notesAtTime = notes.filter((note) => {
    const noteStartTime =
      song.startTime + beatsToTime(note.time - tolerance, song.bpm);
    const noteEndTime =
      noteStartTime + beatsToTime(note.duration + 2 * tolerance, song.bpm);
    return elapsed >= noteStartTime && elapsed <= noteEndTime;
  });

  if (notesAtTime.length === 0) {
    return null;
  }

  const nearestNote = notesAtTime.reduce((prev, curr) => {
    const prevDiff = prev?.pitch
      ? findNearestDifference(prev.pitch, pitch)
      : Infinity;
    const currDiff = curr?.pitch
      ? findNearestDifference(curr.pitch, pitch)
      : Infinity;
    return Math.abs(prevDiff) < Math.abs(currDiff) ? prev : curr;
  });

  return nearestNote;
}; 
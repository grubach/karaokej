import { Song } from "../utils/song";
import bierzCoChcesz from "./bierz-co-chcesz";
import bigInJapan from "./big-in-japan";

export type SongScored = Omit<Song, "notes" | "averagePitch"> & {
  score: string;
};

const songs: SongScored[] = [
  bierzCoChcesz,
  bigInJapan,
  // Add more songs here
];

export default songs;

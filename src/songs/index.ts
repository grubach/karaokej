import { Song } from "../utils/song";
import bierzCoChcesz from "./bierz-co-chcesz";
import womanizer from "./womanizer";
import nieLiczeGodzinILat from "./nie-licze-godzin-i-lat";

export type SongScored = Omit<Song, "notes" | "averagePitch" | "video"> & {
  score: string;
  originalVideo: string;
  karaokeVideo: string;
};

const songs: SongScored[] = [
  bierzCoChcesz,
  womanizer,
  nieLiczeGodzinILat,
  // Add more songs here
];

export default songs;

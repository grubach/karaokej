import { Song } from "../utils/song";
import bierzCoChcesz from "./bierz-co-chcesz";
import womanizer from "./womanizer";
import nieLiczeGodzinILat from "./nie-licze-godzin-i-lat";
import selfControl from "./self-control";
import standByMe from "./stand-by-me";
import summerWine from "./summer-wine";
import jakZapomniec from "./jak-zapomniec";
import illusion from "./illusion";

export type SongScored = Omit<Song, "notes" | "averagePitch" | "video"> & {
  score: string;
  originalVideo: string;
  karaokeVideo: string;
};

const songs: SongScored[] = [
  bierzCoChcesz,
  womanizer,
  nieLiczeGodzinILat,
  selfControl,
  standByMe,
  summerWine,
  jakZapomniec,
  illusion,
  // Add more songs here
];

export default songs;

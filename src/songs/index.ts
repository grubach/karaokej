import bierzCoChcesz from "./bierz-co-chcesz";
import womanizer from "./womanizer";
import nieLiczeGodzinILat from "./nie-licze-godzin-i-lat";
import selfControl from "./self-control";
import standByMe from "./stand-by-me";
import summerWine from "./summer-wine";
import jakZapomniec from "./jak-zapomniec";
import illusion from "./illusion";
import katyOnAMission from "./katy-on-a-mission";

export type SongScored = {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  startTime: number;
  endTime: number;
  score: string;
  originalVideo: string;
  karaokeVideo: string;
};

export const emptySong: SongScored = {
  id: "",
  title: "",
  artist: "",
  bpm: 0,
  startTime: 0,
  endTime: 0,
  score: "",
  originalVideo: "",
  karaokeVideo: "",
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
  katyOnAMission,
  // Add more songs here
];

export default songs;

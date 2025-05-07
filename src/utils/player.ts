import YouTubePlayer from "youtube-player";
import { appStore } from "../store/app";

export let player: ReturnType<typeof YouTubePlayer> | null = null;

const stateNames = {
  "-1": "unstarted",
  0: "ended",
  1: "playing",
  2: "paused",
  3: "buffering",
  5: "video cued",
} as const;

export type PlayerState = (typeof stateNames)[keyof typeof stateNames];

export const loadPlayer = () => {
  if (player) {
    return;
  }

  const playerElement = document.getElementById("video-player");
  if (!playerElement) {
    throw new Error("Player element not found");
  }
  player = YouTubePlayer(playerElement, {
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      enablejsapi: 1,
    },
  });

  player.on("stateChange", (event) => {
    const playerState = stateNames[event.data as keyof typeof stateNames];

    if (!playerState) {
      console.error("Unknown state:", event.data);
      return;
    }

    appStore.updateValue((store) => ({
      ...store,
      playerState,
    }));
  });
};

export const loadVideo = (videoId: string) => {
  console.log("Loading video:", videoId);
  if (!player) {
    console.error("YouTube Player not loaded");
    return;
  }
  return player.cueVideoById(videoId);
};

export const playVideo = () => {
  if (!player) {
    console.error("YouTube Player not loaded");
    return;
  }
  // player.setPlaybackRate(0.5);
  return player.playVideo();
};

export const pauseVideo = () => {
  if (!player) {
    console.error("YouTube Player not loaded");
    return;
  }
  return player.pauseVideo();
};

export const restartVideo = async () => {
  if (!player) {
    console.error("YouTube Player not loaded");
    return;
  }
  await player.seekTo(0, true);
  await player.playVideo();
};

export const stopVideo = async () => {
  if (!player) {
    console.error("YouTube Player not loaded");
    return;
  }
  await player.pauseVideo();
  await player.seekTo(0, true);
};

export const seekTo = async (seconds: number) => {
  if (!player) {
    console.error("YouTube Player not loaded");
    return;
  }
  await player.seekTo(seconds, true);
};

export const setVideoSpeed = (speed: number) => {
  if (!player) {
    console.error("YouTube Player not loaded");
    return;
  }
  return player.setPlaybackRate(speed);
};

export const getVideoTime = async () => {
  if (!player) {
    console.error("YouTube Player not loaded");
    return 0;
  }
  return player.getCurrentTime(); // in seconds
};

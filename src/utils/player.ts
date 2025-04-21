import YouTubePlayer from "youtube-player";

export let player: ReturnType<typeof YouTubePlayer> | null = null;

export const loadPlayer = () => {
  if (player) {
    console.log("YouTube Player already loaded");
    return;
  }
  console.log("YouTube Player loaded");

  const playerElement = document.getElementById("video-player");
  if (!playerElement) {
    throw new Error("Player element not found");
  }
  player = YouTubePlayer(playerElement, {
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
      rel: 0,
      enablejsapi: 1,
    },
  });
};

export const loadVideo = (videoId: string) => {
  if (!player) {
    console.error("YouTube Player not loaded");
    return;
  }
  player.cueVideoById(videoId);
};

export const playVideo = () => {
  if (!player) {
    console.error("YouTube Player not loaded");
    return;
  }
  player.seekTo(0, true);
  // player.setPlaybackRate(0.5);
  player.playVideo();
};

export const pauseVideo = () => {
  if (!player) {
    console.error("YouTube Player not loaded");
    return;
  }
  player.pauseVideo();
};

export const seekTo = (seconds: number) => {
  if (!player) {
    console.error("YouTube Player not loaded");
    return;
  }
  player.seekTo(seconds, true);
};

export const getVideoTime = async () => {
  if (!player) {
    console.error("YouTube Player not loaded");
    return 0;
  }
  const time = await player.getCurrentTime();
  return time; // Time in seconds
};

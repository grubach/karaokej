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

  player.cueVideoById("ayONooHdYdk");
};

export const playVideo = () => {
  if (!player) {
    console.error("YouTube Player not loaded");
    return;
  }
  player.seekTo(0, true);
  player.playVideo();
};

export const pauseVideo = () => {
  if (!player) {
    console.error("YouTube Player not loaded");
    return;
  }
  player.pauseVideo();
};

export const seekTo = (time: number) => {
  if (!player) {
    console.error("YouTube Player not loaded");
    return;
  }
  player.seekTo(time / 1000, true); // Convert milliseconds to seconds
};

export const getVideoTime = async () => {
  if (!player) {
    console.error("YouTube Player not loaded");
    return 0;
  }
  const time = await player.getCurrentTime();
  return time * 1000; // Convert to milliseconds
};

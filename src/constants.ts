export const DETECTIONS_PER_SECOND = 40;
export const HISTORY_DURATION = 2.5; // seconds
export const HISTORY_SIZE = HISTORY_DURATION * DETECTIONS_PER_SECOND;
export const LATENCY = 250; // ms

export const NOTE_HEIGHT = 20; // px
document.documentElement.style.setProperty("--note-height", `${NOTE_HEIGHT}px`);

export const BEAT_WIDTH = 4 * NOTE_HEIGHT; // px
document.documentElement.style.setProperty("--beat-width", `${BEAT_WIDTH}px`);

export const COLOR_BORDER = "#333333";
document.documentElement.style.setProperty("--color-border", COLOR_BORDER);

export const COLOR_PASSED = "#004400";
document.documentElement.style.setProperty("--color-passed", COLOR_PASSED);

export const COLOR_CURSOR = "#00ffff";
document.documentElement.style.setProperty("--color-cursor", COLOR_CURSOR);

export const COLOR_GOOD = "#00ff00";
document.documentElement.style.setProperty("--color-good", COLOR_GOOD);

export const COLOR_NOTE = "#0000ff";
document.documentElement.style.setProperty("--color-note", COLOR_NOTE);

export const COLOR_BACKGROUND = "#252525";
document.documentElement.style.setProperty(
  "--color-background",
  COLOR_BACKGROUND
);
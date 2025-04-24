export const DETECTIONS_PER_SECOND = 60;
export const HISTORY_DURATION = 1; // seconds
export const HISTORY_SIZE = HISTORY_DURATION * DETECTIONS_PER_SECOND;
export const PREHISTORY_SIZE = 5;
export const LATENCY = 0.5; // seconds

export const NOTE_HEIGHT = 20; // px
export const BEAT_WIDTH = 4 * NOTE_HEIGHT; // px
export const BORDER_RADIUS = 0.25 * NOTE_HEIGHT; // px
export const STROKE_WIDTH = 2; // px
export const COLOR_TEXT = "#ffffffcc";
export const COLOR_BORDER = "#333333";
export const COLOR_PASSED = "#004400";
export const COLOR_CURSOR = "#00ffff";
export const COLOR_ACCENT = "#ff88ff";
export const COLOR_GOOD = "#00ff00";
export const COLOR_NOTE = "#0000ff";
export const COLOR_BACKGROUND = "#252525";

document.documentElement.style.setProperty("--note-height", `${NOTE_HEIGHT}px`);
document.documentElement.style.setProperty("--beat-width", `${BEAT_WIDTH}px`);
document.documentElement.style.setProperty(
  "--border-radius",
  `${BORDER_RADIUS}px`
);
document.documentElement.style.setProperty(
  "--stroke-width",
  `${STROKE_WIDTH}px`
);
document.documentElement.style.setProperty("--color-text", COLOR_TEXT);
document.documentElement.style.setProperty("--color-border", COLOR_BORDER);
document.documentElement.style.setProperty("--color-passed", COLOR_PASSED);
document.documentElement.style.setProperty("--color-cursor", COLOR_CURSOR);
document.documentElement.style.setProperty("--color-accent", COLOR_ACCENT);
document.documentElement.style.setProperty("--color-good", COLOR_GOOD);
document.documentElement.style.setProperty("--color-note", COLOR_NOTE);
document.documentElement.style.setProperty(
  "--color-background",
  COLOR_BACKGROUND
);

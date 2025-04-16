export const DETECTIONS_PER_SECOND = 60;
export const HISTORY_DURATION = 2.5; // seconds
export const HISTORY_SIZE = HISTORY_DURATION * DETECTIONS_PER_SECOND;

export const NOTE_HEIGHT = 20; // px
document.documentElement.style.setProperty("--note-height", `${NOTE_HEIGHT}px`);

export const BEAT_WIDTH = 4 * NOTE_HEIGHT; // px
document.documentElement.style.setProperty("--beat-width", `${BEAT_WIDTH}px`);

export const COLOR_BORDER = "#333333";
document.documentElement.style.setProperty("--color-border", COLOR_BORDER);

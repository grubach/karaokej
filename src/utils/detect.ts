import { PitchDetector } from "pitchy";
import {
  DETECTIONS_PER_SECOND,
  HISTORY_SIZE,
  PREHISTORY_SIZE,
} from "../constants";

const INPUT_BUFFER_SIZE = 1024 * 4;
const SAMPLE_RATE = 48000;
const MINIMUM_CLARITY = 0.1;
const MINIMUM_DECIBELS = -25;
const MINIMUM_HZ = 10;
const MAXIMUM_HZ = 1000;
const MAXIMUM_PITCH = 8 * 12; // semitones
const MINIMUM_PITCH = 1 * 12; // semitones

let analyserNode: AnalyserNode;
let inputBuffer: Float32Array;
let detector: PitchDetector<Float32Array>;
let sampleRate: number;

const history: (number | null)[] = Array.from(
  { length: HISTORY_SIZE },
  () => null
);

const prehistory: (number | null)[] = Array.from(
  { length: PREHISTORY_SIZE },
  () => null
);

const cleanupPrehistory = () => {
  const minLength = 3;
  const maxDistance = 8;

  const isBreak = (i: number) => {
    const note = prehistory[i];
    const prevNote = prehistory[i + 1] ?? null;

    return !note || !prevNote || Math.abs(note - prevNote) > maxDistance;
  };

  if (!isBreak(0) || prehistory[1] === null) {
    return;
  }

  const breakIndex = prehistory.findIndex((_, i) => i > 0 && isBreak(i));

  if (breakIndex === -1 || breakIndex > minLength) {
    return;
  }

  for (let i = 0; i <= breakIndex; i++) {
    prehistory[i] = null;
  }
};

const passPrehistory = (note: number | null): number | null => {
  prehistory.unshift(note);
  const pop = prehistory.pop() ?? null;

  cleanupPrehistory();

  return pop;
};

export const positionFromHz = (hz: number): number => {
  const position = 12 * Math.log2(hz / 440) + 57; // A4 = 440Hz
  return position;
};

const pushToHistory = (position: number | null) => {
  history.unshift(position);
  history.pop();
};

export const getHistory = () => history;

export const getLastDetectedPitch = () => history[0];

let initialized = false;
export const initAudioContext = async () => {
  if (initialized) {
    return;
  }
  initialized = true;
  const audioContext = new AudioContext({
    sampleRate: SAMPLE_RATE,
  });
  const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

  analyserNode = new AnalyserNode(audioContext, {
    fftSize: INPUT_BUFFER_SIZE,
    smoothingTimeConstant: 0,
  });
  audioContext.createMediaStreamSource(micStream).connect(analyserNode);
  sampleRate = audioContext.sampleRate;

  detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
  detector.minVolumeDecibels = MINIMUM_DECIBELS;
  inputBuffer = new Float32Array(detector.inputLength);
};

export const detect = () => {
  if (!analyserNode || !inputBuffer) return null;
  analyserNode.getFloatTimeDomainData(inputBuffer);
  const [pitch, clarity] = detector.findPitch(inputBuffer, sampleRate);
  const rawValue = clarity > MINIMUM_CLARITY ? pitch : null;
  const value = passPrehistory(rawValue);

  if (!value) {
    return null;
  }

  if (value < MINIMUM_HZ || value > MAXIMUM_HZ) {
    return null;
  }

  const semitones = positionFromHz(value);

  if (semitones < MINIMUM_PITCH || semitones > MAXIMUM_PITCH) {
    return null;
  }

  return semitones;
};

const writeHistory = () => {
  pushToHistory(detect());
};

let interval: number;
export const startDetecting = async () => {
  if (interval) {
    clearInterval(interval);
  }
  await initAudioContext();
  interval = setInterval(writeHistory, 1000 / DETECTIONS_PER_SECOND);
  return true;
};

export const stopDetecting = () => {
  if (interval) {
    clearInterval(interval);
  }
  interval = 0;
  return true;
};

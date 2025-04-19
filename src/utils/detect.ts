import { PitchDetector } from "pitchy";
import { DETECTIONS_PER_SECOND, HISTORY_SIZE } from "../constants";

const INPUT_BUFFER_SIZE = 1024 * 4;
const SAMPLE_RATE = 48000;
const MINIMUM_CLARITY = 0.25;
const MINIMUM_DECIBELS = -20;
const MINIMUM_HZ = 10; 
const MAXIMUM_HZ = 1000; 

let analyserNode: AnalyserNode;
let inputBuffer: Float32Array;
let detector: PitchDetector<Float32Array>;
let sampleRate: number;

const history: (number | null)[] = Array.from(
  { length: HISTORY_SIZE },
  () => null
);

export const positionFromHz = (hz: number): number => {
  const position = 12 * Math.log2(hz / 440) + 57; // A4 = 440Hz
  return position;
};

const pushToHistory = (position: number | null) => {
  history.unshift(position);
  history.pop();
};

export const getHistory = () => history;

let initialized = false;
export const resetAudioContext = async () => {
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
    smoothingTimeConstant: .1,
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
  const value = clarity > MINIMUM_CLARITY ? pitch : null;
  if (!value) {
    return null;
  }

  if (value < MINIMUM_HZ || value > MAXIMUM_HZ) {
    return null;
  }
  const semitones = positionFromHz(value);

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
  await resetAudioContext();
  interval = setInterval(writeHistory, 1000 / DETECTIONS_PER_SECOND);
  return true;
};

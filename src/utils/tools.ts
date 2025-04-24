export const distortion = (value: number, strength: number) => {
  return value + (Math.random() - 0.5) * (value * strength);
};
export const noise = (strength: number) => {
  return (Math.random() - 0.5) * strength;
};
export const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value));
}

export const roundTo = (value: number, precision: number) => {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

export const removeOutliners = (arr: number[]) => {
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const std = Math.sqrt(
    arr.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) /
      arr.length
  );
  return arr.filter((x) => Math.abs(x - mean) < std);
}

export const formatSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}
  

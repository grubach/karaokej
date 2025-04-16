export const distortion = (value: number, strength: number) => {
  return value + (Math.random() - 0.5) * (value * strength);
};
export const noise = (strength: number) => {
  return (Math.random() - 0.5) * strength;
};

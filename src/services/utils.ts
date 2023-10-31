import { IColor } from "./interfaces";

export function generateGradientTable(startColor: IColor, endColor: IColor, steps: number) {
  const gradientTable: Array<string> = [];
  for (let i = 0; i < steps; i++) {
    const r = startColor.r + ((endColor.r - startColor.r) * i) / (steps - 1);
    const g = startColor.g + ((endColor.g - startColor.g) * i) / (steps - 1);
    const b = startColor.b + ((endColor.b - startColor.b) * i) / (steps - 1);
    gradientTable.push(
      `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
    );
  }
  return gradientTable;
}

export function calculatePitches(pitches: Array<number>) {
  let pitch_min = Math.min(...pitches);
  let pitch_max = Math.max(...pitches);
  let pitch_span = pitch_max - pitch_min;

  // If the span is too low, we have to extend it equally on both sides
  if (pitch_span < 24) {
    const diff = 24 - pitch_span;
    const low = Math.ceil(diff / 2);
    const high = Math.floor(diff / 2);
    pitch_min -= low;
    pitch_max += high;
  }

  // And margin up and down
  pitch_min -= 3;
  pitch_max += 3;
  pitch_span = pitch_max - pitch_min;

  return { pitch_min, pitch_max, pitch_span };
};
import { generateGradientTable } from "./utils";

export const BACKGROUND_START_COLOR = { r: 93, g: 181, b: 213 };
export const BACKGROUND_END_COLOR = { r: 21, g: 65, b: 81 };
export const BACKGROUND_COLOR_MAP = generateGradientTable(
  BACKGROUND_START_COLOR,
  BACKGROUND_END_COLOR,
  128
);

export const NOTE_START_COLOR = { r: 66, g: 66, b: 61 };
export const NOTE_END_COLOR = { r: 28, g: 28, b: 26 };
export const NOTE_COLOR_MAP = generateGradientTable(
  NOTE_START_COLOR,
  NOTE_END_COLOR,
  128
);


export const N_ROLLS = 20;
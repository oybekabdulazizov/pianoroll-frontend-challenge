import { FC, Fragment, useEffect, useState } from 'react';
import { IData } from '../services/interfaces';
import { generateGradientTable } from '../services/utils';

const BACKGROUND_START_COLOR = { r: 93, g: 181, b: 213 };
const BACKGROUND_END_COLOR = { r: 21, g: 65, b: 81 };
const BACKGROUND_COLOR_MAP = generateGradientTable(
  BACKGROUND_START_COLOR,
  BACKGROUND_END_COLOR,
  128
);
const NOTE_START_COLOR = { r: 66, g: 66, b: 61 };
const NOTE_END_COLOR = { r: 28, g: 28, b: 26 };
const NOTE_COLOR_MAP = generateGradientTable(
  NOTE_START_COLOR,
  NOTE_END_COLOR,
  128
);

interface IPianoRoll {
  sequence: Array<IData>;
}

const PianoRoll: FC<IPianoRoll> = ({ sequence }) => {
  const [seq, setSeq] = useState<Array<IData>>([]);
  const [start, setStart] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);
  const [noteHeight, setNoteHeight] = useState<number | null>(null);
  const [svgChildren, setSvgChildren] = useState<Array<JSX.Element>>([]);

  const drawEmptyPianoRoll = (
    pitchMin: number,
    pitchMax: number,
    arr: Array<JSX.Element>
  ) => {
    const pitchSpan = pitchMax - pitchMin;
    for (let it = pitchMin; it <= pitchMax + 1; it++) {
      // Black keys
      let rect;
      if ([1, 3, 6, 8, 10].includes(it % 12)) {
        const y = 1 - (it - pitchMin) / pitchSpan;
        const x = 0;
        const height = 1 / pitchSpan;
        const width = 1;
        rect = (
          <rect
            fill={BACKGROUND_COLOR_MAP[12]}
            fillOpacity={0.666}
            x={x}
            y={y}
            width={width}
            height={height}
          />
        );
        arr.push(rect);
      }

      // Key separation
      const y = 1 - (it - pitchMin) / pitchSpan + 1 / pitchSpan;

      let line_width;
      // Every octave, line is bolder
      if (it % 12 === 0) {
        line_width = 0.003;
      } else {
        line_width = 0.001;
      }
      const line = (
        <line
          x1={0}
          y1={y}
          x2={2}
          y2={y}
          strokeWidth={line_width}
          stroke='black'
        />
      );
      arr.push(line);
    }
  };

  const timeToX = (time: number) => {
    return time / end!;
  };

  const drawPianoRoll = () => {
    const arr: Array<JSX.Element> = [];
    // Extract just the pitches to prepare the SVG parameters
    const pitches = seq.map((note) => {
      return note.pitch;
    });

    const { pitch_min, pitch_max, pitch_span } = calculatePitches(pitches);

    drawEmptyPianoRoll(pitch_min, pitch_max, arr);

    seq.forEach((note) => {
      const x = timeToX(note.start - start!);
      const width = timeToX(note.end - note.start);
      const y = 1 - (note.pitch - pitch_min) / pitch_span;

      const color = NOTE_COLOR_MAP[note.velocity];

      const note_rectangle = (
        <rect
          x={`${x}`}
          width={`${width}`}
          y={`${y}`}
          height={`${noteHeight!}`}
          fill={color}
          className='note-rectangle'
        />
      );
      arr.push(note_rectangle);
    });

    setSvgChildren([...arr]);
  };

  useEffect(() => {
    if (seq.length < 1) {
      setSeq(sequence);
      setStart(sequence[0].start);
      setEnd(sequence[sequence.length - 1].end - sequence[0].start);
      
      const pitches = sequence.map((note) => {
        return note.pitch;
      });
      const { pitch_span } = calculatePitches(pitches);
      setNoteHeight(1 / pitch_span);
    }
  }, []);

  useEffect(() => {
    drawPianoRoll();
  }, [seq]);

  return (
    <svg
      className='piano-roll-svg'
      width='100%'
      // height='10%'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 1 1'
      preserveAspectRatio='none'
    >
      {svgChildren.map((child, i) => (
        <Fragment key={i}>{child}</Fragment>
      ))}
    </svg>
  );
};

export default PianoRoll;

const calculatePitches = (pitches: Array<number>) => {
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

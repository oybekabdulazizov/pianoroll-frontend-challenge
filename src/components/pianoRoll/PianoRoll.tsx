import { FC, Fragment, useEffect, useState } from 'react';

import { IData } from '../../services/interfaces';
import { calculatePitches } from '../../services/utils';
import { BACKGROUND_COLOR_MAP, NOTE_COLOR_MAP } from '../../services/constants';
import { IPianoRoll } from './IPianoRoll';

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

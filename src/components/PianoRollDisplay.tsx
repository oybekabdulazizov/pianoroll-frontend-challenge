import { FC, useEffect, useState } from 'react';

import { IData } from '../services/interfaces';
import PianoRoll from './PianoRoll';
import { N_ROLLS } from '../services/constants';

const PianoRollDisplay: FC = () => {
  const [pianoRolls, setPianoRolls] = useState<Array<JSX.Element>>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('https://pianoroll.ai/random_notes');
        if (!response.ok) {
          throw new Error(
            `PianoRollDisplay data fetch error: ${response.status}`
          );
        }
        generateSVGs(await response.json());
      } catch (error: any) {
        console.log(error.message);
      }
    };

    loadData();
  }, []);

  const generateSVGs = (data: Array<IData>) => {
    let arr: Array<JSX.Element> = [];
    data.map((_item, i) => {
      if (i < N_ROLLS) {
        const start = i * 60;
        const end = start + 60;
        const partData = data.slice(start, end);

        const item = <PianoRoll sequence={partData} />;
        arr.push(item);
      }
    });
    setPianoRolls([...arr]);
  };

  return (
    <div className='w-full flex flex-col items-center p-10'>
      <div
        id='pianoRollContainer'
        className='w-full grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4'
      >
        {pianoRolls && pianoRolls.length > 0 && (
          <>
            {pianoRolls.map((pianoRoll, idx) => (
              <div key={idx} className='piano-roll-card lg:h-64 h-56'>
                <div className='description'>
                  This is a piano roll number {idx}
                </div>
                {pianoRoll}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default PianoRollDisplay;

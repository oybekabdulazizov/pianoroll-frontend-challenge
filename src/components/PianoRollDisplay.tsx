import { FC, useEffect, useState } from 'react';

import { IData } from '../services/interfaces';
import PianoRoll from './pianoRoll/PianoRoll';
import { N_ROLLS } from '../services/constants';

const PianoRollDisplay: FC = () => {
  const [selectedItem, setSelectedItem] = useState<JSX.Element | null>(null);
  const [pianoRolls, setPianoRolls] = useState<Array<JSX.Element>>([]);
  const [i, setI] = useState<number | null>(null);

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

  useEffect(() => {
    if (i !== null) {
      setSelectedItem(pianoRolls[i]);
    }
  }, [i]);

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

  const handleClick = (idx: number) => {
    if (i !== idx) {
      setSelectedItem(null);
      setI(idx);
    }
  };

  const handleCancel = () => {
    setI(null);
    setSelectedItem(null);
  };

  return (
    <div
      className={`w-full p-10 grid md:gap-8 gap-20 ${
        selectedItem ? 'lg:grid-cols-4 md:grid-cols-3' : ''
      }`}
    >
      {selectedItem && i !== null && (
        <div className='relative border-2 border-red-300 rounded-lg h-72 sm:h-[350px] pb-16 px-4 md:h-[10%] lg:col-span-3 md:col-span-2 sm:col-span-1'>
          <div className='description'>This is a piano roll number {i}</div>
          <button
            className='absolute right-5 top-0 text-red-600 text-2xl font-bold'
            onClick={handleCancel}
          >
            x
          </button>
          {selectedItem}
        </div>
      )}
      <div
        id='pianoRollContainer'
        className={`w-full col-span-1 grid gap-6 ${
          selectedItem
            ? 'grid-cols-1'
            : 'lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1'
        }`}
      >
        {pianoRolls && pianoRolls.length > 0 && (
          <>
            {pianoRolls.map((pianoRoll, idx) => (
              <div
                key={idx}
                className='piano-roll-card lg:h-64 h-56 hover:cursor-pointer'
                onClick={() => handleClick(idx)}
              >
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

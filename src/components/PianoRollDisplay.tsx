import { FC, useEffect, useState } from 'react';

import { IData } from '../services/interfaces';
import PianoRoll from '../services/pianoroll';

const PianoRollDisplay: FC = () => {
  const [data, setData] = useState<Array<IData>>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('https://pianoroll.ai/random_notes');
        if (!response.ok) {
          throw new Error(
            `PianoRollDisplay data fetch error: ${response.status}`
          );
        }
        setData(await response.json());
      } catch (error: any) {
        console.log(error.message);
      }
    };

    loadData();
  }, []);

  const preparePianoRollCard = (rollId: number) => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('piano-roll-card');

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('description');
    descriptionDiv.textContent = `This is a piano roll number ${rollId}`;
    cardDiv.appendChild(descriptionDiv);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('piano-roll-svg');
    svg.setAttribute('width', '80%');
    svg.setAttribute('height', '150');
    cardDiv.appendChild(svg);

    return { cardDiv, svg };
  };

  const generateSVGs = () => {
    data.map((_item, i) => {
      if (i < 20) {
        const start = i * 60;
        const end = start + 60;
        const partData = data.slice(start, end);

        const { cardDiv, svg } = preparePianoRollCard(i);
        new PianoRoll(svg, partData);

        const pianoRollContainer =
          document.getElementById('pianoRollContainer');
        pianoRollContainer?.appendChild(cardDiv);
      }
    });
  };

  return (
    <div className='flex flex-col items-center w-full'>
      <button className='load-svgs my-3' onClick={generateSVGs}>
        Load Piano Rolls!
      </button>
      <div
        id='pianoRollContainer'
        className='w-full flex flex-col items-center gap-2 mb-2'
      ></div>
    </div>
  );
};

export default PianoRollDisplay;

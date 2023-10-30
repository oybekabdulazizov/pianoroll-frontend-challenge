import { FC, useEffect } from 'react';

import { IData } from '../services/interfaces';
import PianoRoll from '../services/pianoroll';

const PianoRollDisplay: FC = () => {
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

  const preparePianoRollCard = (rollId: number) => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('piano-roll-card');

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('description');
    descriptionDiv.textContent = `This is a piano roll number ${rollId}`;
    cardDiv.appendChild(descriptionDiv);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('piano-roll-svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '150');
    cardDiv.appendChild(svg);

    return { cardDiv, svg };
  };

  const generateSVGs = (data: Array<IData>) => {
    const pianoRollContainer = document.getElementById('pianoRollContainer');
    data.map((_item, i) => {
      if (i < 20) {
        const start = i * 60;
        const end = start + 60;
        const partData = data.slice(start, end);

        const { cardDiv, svg } = preparePianoRollCard(i);
        new PianoRoll(svg, partData);
        pianoRollContainer?.appendChild(cardDiv);
      }
    });
  };

  return (
    <div className='flex flex-col items-center w-full p-10'>
      <div
        id='pianoRollContainer'
        className='w-full flex flex-col items-center gap-2 mb-2'
      ></div>
    </div>
  );
};

export default PianoRollDisplay;

import { FC } from 'react';
import Navbar from './components/navbar/Navbar';
import PianoRollDisplay from './components/pianoRollDisplay/PianoRollDisplay';

const App: FC = () => {
  return (
    <>
      <Navbar />
      <PianoRollDisplay />
    </>
  );
};

export default App;

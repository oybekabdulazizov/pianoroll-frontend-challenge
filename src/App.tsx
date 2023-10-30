import { FC } from 'react';
import Navbar from './components/Navbar';
import PianoRollDisplay from './components/PianoRollDisplay';

const App: FC = () => {
  return (
    <>
      <Navbar />
      <PianoRollDisplay />
    </>
  );
};

export default App;

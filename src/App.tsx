import { FC } from 'react';
import Navbar from './components/Navbar';
import PianoRollDisplay from './components/PianoRollDisplay';

const App: FC = () => {
  return (
    <>
      <Navbar />
      <h1 className='font-semibold text-5xl text-center my-3'>
        Welcome to PianoRoll frontend coding challenge!
      </h1>
      <PianoRollDisplay />
    </>
  );
};

export default App;

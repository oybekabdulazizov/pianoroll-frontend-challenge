import { FC } from 'react';
import Navbar from './components/Navbar';

const App: FC = () => {
  return (
    <div>
      <Navbar />
      <h1 className='font-semibold text-4xl text-center'>
        Welcome to PianoRoll frontend coding challenge!
      </h1>
    </div>
  );
};

export default App;

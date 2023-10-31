import { FC } from 'react';

const Navbar: FC = () => {
  return (
    <nav className='flex items-center justify-between bg-[#154151] shadow-3xl'>
      <img src='/assets/white.svg' className='h-9 w-auto my-1' alt='logo' />
    </nav>
  );
};

export default Navbar;

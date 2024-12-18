import React from 'react';
import logo from './img/ejuuz.png';
import Profile from '../Profile/Profile';
import Timer from '../Timer/Timer';

function Header() {
  return (
    <header className="w-full h-[10%] bg-blue-900 px-5 py-2 flex justify-between items-center">
      <div className="w-[40%] md:w-[10%] ml-4 h-full flex items-center">
        <img src={logo} alt="Ejuuz" className="w-full" />
      </div>
      <div className="w-full flex justify-end gap-8 items-center">
        <Profile />
        <Timer />
      </div>
    </header>
  );
}

export default Header;

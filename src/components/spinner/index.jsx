import React from 'react';
import logo from '../../images/logo.svg';

function GrowingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="inline-block animate-bounce h-20 w-20 rounded-full align-[-0.125em] motion-reduce:animate-[spinner-grow_1.5s_linear_infinite]">
        <img src={logo} alt="logo" width={100} />
      </div>
    </div>
  );
}

export default GrowingSpinner;

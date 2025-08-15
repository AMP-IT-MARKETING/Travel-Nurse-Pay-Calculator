
import React, { useState } from 'react';
import { InfoIcon } from './icons/InfoIcon';

interface TooltipProps {
  text: string;
  dark?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, dark = false }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div 
      className="relative flex items-center ml-2"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <InfoIcon className={`w-4 h-4 cursor-pointer ${dark ? 'text-teal-100' : 'text-gray-400'}`} />
      {visible && (
        <div 
          className="absolute bottom-full mb-2 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10 left-1/2 -translate-x-1/2"
          style={{ pointerEvents: 'none' }}
        >
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

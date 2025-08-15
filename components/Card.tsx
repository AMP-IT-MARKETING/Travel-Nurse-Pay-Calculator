
import React from 'react';
import { Tooltip } from './Tooltip';

interface CardProps {
  title: string;
  value: string;
  tooltip?: string;
  primary?: boolean;
}

export const Card: React.FC<CardProps> = ({ title, value, tooltip, primary = false }) => {
  const primaryClasses = primary 
    ? 'bg-[#00AAA1] text-white' 
    : 'bg-white text-[#3E4E56]';
  const valueClasses = primary 
    ? 'text-white' 
    : 'text-[#137D79]';

  return (
    <div className={`rounded-xl shadow-lg p-4 flex flex-col justify-between ${primaryClasses}`}>
      <div className="flex items-center justify-between">
        <h3 className={`font-semibold text-sm uppercase tracking-wide ${primary ? 'text-teal-100' : 'text-gray-500'}`}>{title}</h3>
        {tooltip && <Tooltip text={tooltip} dark={primary} />}
      </div>
      <p className={`text-3xl font-bold mt-2 ${valueClasses}`}>{value}</p>
    </div>
  );
};

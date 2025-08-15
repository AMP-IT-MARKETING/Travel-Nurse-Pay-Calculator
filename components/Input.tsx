
import React from 'react';
import { Tooltip } from './Tooltip';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  tooltip?: string;
}

export const Input: React.FC<InputProps> = ({ label, tooltip, name, ...props }) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        <span className="flex items-center">
          {label}
          {tooltip && <Tooltip text={tooltip} />}
        </span>
      </label>
      <input
        id={name}
        name={name}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00AAA1] focus:border-[#00AAA1] transition"
        {...props}
      />
    </div>
  );
};

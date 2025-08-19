import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center p-10">
    <div className="w-12 h-12 border-4 border-[#00AAA1] border-t-transparent rounded-full animate-spin"></div>
    <span className="ml-4 text-lg text-[#3E4E56]">Loading Jobs...</span>
  </div>
);

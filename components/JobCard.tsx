import React from 'react';
import { Job } from '../types';
import { Button } from './Button';
import { formatCurrency } from '../utils/formatters';

interface JobCardProps {
  job: Job;
  onSelect: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelect }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-lg flex flex-col justify-between border hover:shadow-xl transition-shadow duration-300">
      <div>
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider">{job.specialty}</p>
        <h3 className="text-lg font-bold text-[#3E4E56] mt-1">{job.jobTitle}</h3>
        <p className="text-sm text-gray-500 mt-1">{job.city}, {job.state}</p>
        <div className="mt-4 flex justify-between text-sm text-gray-600 border-t pt-3">
            <span>{job.contractWeeks} weeks</span>
            <span>{job.weeklyHours} hrs/wk</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-gray-500 text-sm">Est. Weekly Gross</p>
        <p className="text-3xl font-bold text-[#137D79]">{formatCurrency(job.weeklyGrossPay)}</p>
        <Button onClick={() => onSelect(job)} className="w-full mt-4">
          Calculate My Pay
        </Button>
      </div>
    </div>
  );
};

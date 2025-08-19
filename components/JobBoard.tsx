import React from 'react';
import { Job } from '../types';
import { JobCard } from './JobCard';
import { LoadingSpinner } from './LoadingSpinner';

interface JobBoardProps {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  onSelectJob: (job: Job) => void;
}

export const JobBoard: React.FC<JobBoardProps> = ({ jobs, isLoading, error, onSelectJob }) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow" role="alert">
        <p className="font-bold">Error Fetching Jobs</p>
        <p>{error}</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return <p className="text-center text-gray-500">No jobs found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {jobs.map((job, index) => (
        <JobCard key={`${job.jobTitle}-${job.city}-${index}`} job={job} onSelect={onSelectJob} />
      ))}
    </div>
  );
};

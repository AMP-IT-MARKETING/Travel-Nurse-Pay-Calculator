import { useState, useEffect } from 'react';
import { Job, ApiJob } from '../types';

const mapApiJobToJob = (apiJob: ApiJob): Job => {
    const weeklyPreTax = parseFloat(apiJob.job_Weekly_pre_tax) || 0;
    const weeklyStipend = apiJob.job_Weekly_Stipend_Amount || 0;
    
    return {
        jobTitle: apiJob.Job_Name,
        specialty: apiJob.Job_Speciality,
        city: apiJob.Job_City,
        state: apiJob.Job_State,
        contractWeeks: '13', // API does not provide this, using a standard default.
        weeklyHours: apiJob.Job_Hours_Per_Week,
        weeklyGrossPay: weeklyPreTax + weeklyStipend,
        weeklyStipend: weeklyStipend,
        payPackage: {
            taxableRate: parseFloat(apiJob.Job_Pay_Rate) || 0,
        },
    };
};

export const useJobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobsFromLocalFile = async () => {
            try {
                // Fetch the pre-compiled local JSON file. This is fast and reliable.
                const response = await fetch('/jobs.json');
                if (!response.ok) {
                    throw new Error(`Could not load local job data. Status: ${response.status}`);
                }
                
                const data = await response.json();

                // The local file contains the raw API job structures.
                const allApiJobs: ApiJob[] = data.LTOs || [];
                
                if (allApiJobs.length === 0) {
                     console.warn("Job data file loaded, but it contains no job listings (LTOs).");
                }
                
                const mappedJobs = allApiJobs.map(mapApiJobToJob);
                setJobs(mappedJobs);

            } catch (e) {
                if (e instanceof Error) {
                    setError(`Failed to load job data. (Details: ${e.message})`);
                } else {
                    setError('An unknown error occurred while loading job data.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobsFromLocalFile();
    }, []);

    return { jobs, isLoading, error };
};
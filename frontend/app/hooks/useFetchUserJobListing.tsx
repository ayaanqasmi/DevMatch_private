import { useState, useEffect, useCallback } from "react";
export interface JobListing {
    _id: string
    title: string
    company: string
    description: string
    expiresAt: string
  }
  

type UseFetchJobsReturn = {
  jobs: JobListing[]; // Update the type according to the structure of your resumes
  isLoading: boolean;
  error: string | null;
  fetchJobs: () => Promise<void>;
};

const useFetchUserJobListing = (userId: string | null): UseFetchJobsReturn => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:4000/api/jobs/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust if token is stored elsewhere
        },
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data.data);
      } else {
        const errorData = await response.json();
        setError(errorData.msg || "An error occurred fetching jobs");
      }
    } catch (error) {
      setError("An error occurred fetching jobs");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchJobs();
    }
  }, [userId, fetchJobs]);

  return { jobs, isLoading, error, fetchJobs };
};

export default useFetchUserJobListing;

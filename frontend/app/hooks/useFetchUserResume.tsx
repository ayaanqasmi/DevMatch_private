import { useState, useEffect, useCallback } from "react";
export interface Resume {
    _id: string;
    user_id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }

type UseFetchResumesReturn = {
  resumes: Resume[]; // Update the type according to the structure of your resumes
  isLoading: boolean;
  error: string | null;
  fetchResumes: () => Promise<void>;
};

const useFetchUserResume = (userId: string | null): UseFetchResumesReturn => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResumes = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:4000/api/resume/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust if token is stored elsewhere
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResumes(data.data);
      } else {
        const errorData = await response.json();
        setError(errorData.msg || "An error occurred fetching resumes");
      }
    } catch (error) {
      setError("An error occurred fetching resumes");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchResumes();
    }
  }, [userId, fetchResumes]);

  return { resumes, isLoading, error, fetchResumes };
};

export default useFetchUserResume;

"use client";
"use client";
import { useEffect, useState } from "react";
import useUserData from "../../hooks/useUserData"; // Adjust the path as necessary

const Hire = () => {
    const { userData, loading: userLoading, error: userError } = useUserData();
    const [jobs, setJobs] = useState<any>({}); // Assuming jobs is an array of objects
    const [resumes, setResumes] = useState<any>({});
    const [fetchError, setFetchError] = useState<string | null>(null);
  useEffect(() => {
    const fetchJobData = async () => {
      const response = await fetch(
        `http://localhost:4000/api/similarity/resume/${userData?.user.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json", // Ensures the server knows the expected content type
            Authorization: `Bearer <your_token_here>`, // Include if your API requires authentication
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("hey")
        setJobs(data);
      } else {
        const errorData = await response.json();
        setFetchError(errorData.message || "An error occurred");
      }
    };
    fetchJobData();
  });

  useEffect(() => {
    const fetchResumeData = async () => {
        const response = await fetch(
          `http://localhost:4000/api/resume/user/${userData?.user.user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json", // Ensures the server knows the expected content type
              Authorization: `Bearer <your_token_here>`, // Include if your API requires authentication
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("hey")
          setResumes(data);
        } else {
          const errorData = await response.json();
          setFetchError(errorData.message || "An error occurred");
        }
      };
      fetchResumeData();
  });
  

  return (
    <div>
      <h1>User Profile</h1>
      <h2>User id:</h2>
      <h2>{userData?.user.user.id}</h2>
      <pre>{JSON.stringify(resumes, null, 2)}</pre>
    </div>
  );
};

export default Hire;

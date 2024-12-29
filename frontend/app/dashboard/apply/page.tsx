"use client";

import { useEffect, useState } from "react";
import useUserData from "../../hooks/useUserData"; // Adjust the path as necessary
import useFetchUserResume from "@/app/hooks/useFetchUserResume";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export interface Resume {
  _id: string;
  user_id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Job {
  _id: string;
  recruiter_id: string;
  title: string;
  company: string;
  description: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  similarity: number;
}

const Apply = () => {
  const { userData, loading: userLoading, error: userError } = useUserData();
  const {
    resumes,
    isLoading: resumesLoading,
    error: resumesError,
    fetchResumes,
  } = useFetchUserResume(userData?.user.user.id);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [expandedCards, setExpandedCards] = useState<{[key:string]:boolean}>({}); // Track expanded state for each card

  const toggleExpanded = (jobId: string) => {
    setExpandedCards((prev: Record<string, boolean>) => ({
      ...prev,
      [jobId]: !prev[jobId], // Toggle the expanded state for the specific card
    }));
  };

  const fetchJobData = async (id: string) => {
    setJobsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/similarity/resume/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setJobs(data.data);
      } else {
        const errorData = await response.json();
        setFetchError(errorData.message || "An error occurred fetching jobs");
      }
    } catch (error) {
      setFetchError("An error occurred fetching jobs");
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedResumeId && userData) {
      fetchJobData(selectedResumeId);
    }
  }, [selectedResumeId, userData]);

  const handleApply = (jobId: string) => {
    // Implement apply logic here
    console.log(`Applied to job ${jobId}`);
  };

  if (userLoading) {
    return (
      <div className="container mx-auto p-4 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Job Matching</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Resumes</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="w-full h-[300px]" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Matching Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="w-full h-[300px]" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  
  

  if (userError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{userError}</AlertDescription>
      </Alert>
    )
  }
  else if(fetchError){
    <Alert variant="destructive">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{fetchError}</AlertDescription>
  </Alert>
  }
  else if(resumesError){
    <Alert variant="destructive">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{resumesError}</AlertDescription>
  </Alert>
  }
  return (
    <div className="container mx-auto p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Job Matching</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Resumes</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {resumesLoading ? (
                <Skeleton className="w-full h-[300px]" />
              ) : resumes.length > 0 ? (
                resumes.map((resume) => (
                  <div className="flex items-center justify-center">
                    <Button
                      key={resume._id}
                      onClick={() => setSelectedResumeId(resume._id)}
                      className={`w-full mb-2 justify-start ${
                        selectedResumeId === resume._id
                          ? "bg-blue-100 text-blue-800"
                          : "bg-white text-gray-800"
                      }`}
                      variant="outline"
                    >
                      {resume.name}
                    </Button>
                    <a
                      href={`https://storage.googleapis.com/devmatch-resumes/${resume._id}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 text-blue-500 hover:text-blue-700 flex items-center"
                    >
                      Download
                    </a>
                  </div>
                ))
              ) : (
                <p>No resumes found. Please upload a resume.</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Matching Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {jobsLoading ? (
                <Skeleton className="w-full h-[300px]" />
              ) : jobs.length > 0 ? (
                jobs.map((job: Job) => (
                  <Card key={job._id} className="mb-4">
                    <CardHeader>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">
                        {job.company}
                      </p>
                      <p className="text-sm mb-2">
                        {expandedCards[job._id]
                          ? job.description
                          : `${job.description.substring(0, 100)}...`}
                      </p>
                      <div className="flex justify-between items-center">
                        <button
                          className="text-blue-600 text-sm hover:underline"
                          onClick={() => toggleExpanded(job._id)}
                        >
                          {expandedCards[job._id] ? "See Less" : "See More"}
                        </button>
                        <span className="text-sm font-semibold text-blue-600">
                          Similarity: {(job.similarity * 100).toFixed(2)}%
                        </span>

                        <Button onClick={() => handleApply(job._id)} size="sm">
                          Apply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p>
                  {selectedResumeId
                    ? "No matching jobs found."
                    : "Please select a resume to see matching jobs."}
                </p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Apply;

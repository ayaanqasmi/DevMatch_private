'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import useUserData  from '@/app/hooks/useUserData'
import useFetchUserJobListing from '@/app/hooks/useFetchUserJobListing'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Candidate {
  _id: string
  user_id: string
  name: string
  createdAt: string
  updatedAt: string
  __v: number
  similarity: number
}

export default function HirePage() {
  const { userData, loading: userLoading, error: userError } = useUserData()
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loadingCandidates, setLoadingCandidates] = useState(false)
  const [candidateError, setCandidateError] = useState<string | null>(null)

  const userId = userData?.user?.user?.id
  const { jobs, isLoading: jobsLoading, error: jobsError, fetchJobs } = useFetchUserJobListing(userId)


  const fetchCandidates = async (jobId: string) => {
    setLoadingCandidates(true)
    setCandidateError(null)
    try {
      const response = await fetch(`http://localhost:4000/api/similarity/jobs/${jobId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch candidates')
      }
      const data = await response.json()
      setCandidates(data.data)
    } catch (error) {
      setCandidateError('Error fetching candidates. Please try again.')
    } finally {
      setLoadingCandidates(false)
    }
  }

  const handleJobSelect = (jobId: string) => {
    setSelectedJob(jobId)
    fetchCandidates(jobId)
  }

  const renderJobListings = () => {
    if (jobsLoading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
      )
    }

    if (jobsError) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{jobsError}</AlertDescription>
        </Alert>
      )
    }

    return (
      <div className="space-y-4">
        {jobs?.map((job) => (
          <Card key={job._id} className={selectedJob === job._id ? 'border-blue-500' : ''}>
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{job.description}</p>
              <Button onClick={() => handleJobSelect(job._id)} className="mt-2">
                Select Job
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const renderCandidates = () => {
    if (!selectedJob) {
      return null
    }

    if (loadingCandidates) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
      )
    }

    if (candidateError) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{candidateError}</AlertDescription>
        </Alert>
      )
    }

    return (
      <div className="space-y-4">
        {candidates.map((candidate) => (
          <Card key={candidate._id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-semibold">{candidate.name}</h3>
                <p>Similarity: {(candidate.similarity * 100).toFixed(2)}%</p>
              </div>
              <div className="flex items-center">
                <a
                  href={`https://storage.googleapis.com/devmatch-resumes/${candidate._id}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline mr-4"
                >
                  Download Resume
                </a>
                <Link href={`/dashboard/profile/${candidate.user_id}`} className="text-blue-500 hover:underline" target="_blank">
                  View profile
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (userLoading) {
    return <Skeleton className="h-screen w-full" />
  }

  if (userError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load user data. Please try again.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Hire Candidates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Job Listings</h2>
          {renderJobListings()}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Suitable Candidates</h2>
          {renderCandidates()}
        </div>
      </div>
    </div>
  )
}


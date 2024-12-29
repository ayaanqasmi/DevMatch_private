'use client'
import useUserData from "@/app//hooks/useUserData"; // Adjust the path as necessary
import JobListingForm from "@/components/JobListingForm";
import ResumeForm from "@/components/ResumeForm";
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import useFetchUserResume from '@/app/hooks/useFetchUserResume'
import useFetchUserJobListing from '@/app/hooks/useFetchUserJobListing'

export interface Resume {
  _id: string
  name: string
  createdAt: string
}

export interface JobListing {
  _id: string
  title: string
  company: string
  description: string
  expiresAt: string
}



const UserItems = () => {
  const { userData, loading, error } = useUserData()
  const { resumes, isLoading: resumesLoading, error: resumesError, fetchResumes } = useFetchUserResume(userData?.user.user.id)
  const { jobs: jobListings, isLoading: jobsLoading, error: jobsError, fetchJobs } = useFetchUserJobListing(userData?.user.user.id)
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
  const [isJobListingModalOpen, setIsJobListingModalOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'resume' | 'job' } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (id: string, type: 'resume' | 'job') => {
    setItemToDelete({ id, type })
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`http://localhost:4000/api/${itemToDelete.type === 'resume' ? 'resume' : 'jobs'}/${itemToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${userData?.jwt}` }
      })
      if (response.ok) {
        if (itemToDelete.type === 'resume') {
          fetchResumes()
        } else {
          fetchJobs()
        }
      }
    } catch (error) {
      console.error(`Error deleting ${itemToDelete.type}:`, error)
    } finally {
      setIsDeleting(false)
      setDeleteConfirmOpen(false)
      setItemToDelete(null)
    }
  }

  if (loading) return <div>Loading...</div>

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Tabs defaultValue="resumes" className="w-full">
        <TabsList>
          <TabsTrigger value="resumes">Resumes</TabsTrigger>
          <TabsTrigger value="jobListings">Job Listings</TabsTrigger>
        </TabsList>
        <TabsContent value="resumes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Resumes</CardTitle>
              <Button onClick={() => setIsResumeModalOpen(true)}>Create New Resume</Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {resumesLoading ? (
                  <div>Loading resumes...</div>
                ) : resumesError ? (
                  <div>{resumesError}</div>
                ) : resumes.length === 0 ? (
                  <div>No resumes found.</div>
                ) : (
                  resumes.map(resume => (
                    <div
                    key={resume._id}
                    className="flex justify-between items-center mb-2 p-4 bg-white rounded shadow"
                  >
                    <span className="flex-1 truncate">{resume.name}</span>
                    
                    <div className="flex items-center space-x-4">
                      <a
                        href={`https://storage.googleapis.com/devmatch-resumes/${resume._id}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Download
                      </a>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(resume._id, "resume")}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="jobListings">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Job Listings</CardTitle>
              <Button onClick={() => setIsJobListingModalOpen(true)}>Create New Job Listing</Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {jobsLoading ? (
                  <div>Loading job listings...</div>
                ) : jobsError ? (
                  <div>{jobsError}</div>
                ) : jobListings.length === 0 ? (
                  <div>No job listings found.</div>
                ) : (
                  jobListings.map(job => (
                    <div key={job._id} className="flex justify-between items-center mb-2 p-2 bg-white rounded shadow">
                      <span>{job.title} - {job.company}</span>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteClick(job._id, 'job')}
                      >
                        Delete
                      </Button>
                    </div>
                  ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isResumeModalOpen && (
        <ResumeForm 
          onClose={() => setIsResumeModalOpen(false)} 
          onSuccess={() => {
            setIsResumeModalOpen(false)
            fetchResumes()
          }}
          token={userData?.jwt}
        />
      )}

      {isJobListingModalOpen && (
        <JobListingForm 
          onClose={() => setIsJobListingModalOpen(false)} 
          onSuccess={() => {
            setIsJobListingModalOpen(false)
            fetchJobs()
          }}
          token={userData?.jwt}
        />
      )}

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the {itemToDelete?.type}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserItems;

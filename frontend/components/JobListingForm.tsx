'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface JobListingFormProps {
  onClose: () => void
  onSuccess: () => void
  token: string
}

export default function JobListingForm({ onClose, onSuccess, token }: JobListingFormProps) {
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [description, setDescription] = useState('')
  const [expiresInDays, setExpiresInDays] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('http://localhost:4000/api/jobs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, company, description, expiresInDays: parseInt(expiresInDays) })
      })

      if (response.ok) {
        const result = await response.text()
        setMessage(result)
        onSuccess()
      } else {
        const errorText = await response.text()
        setMessage(`Error: ${errorText}`)
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Job Listing</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Job Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isSubmitting} />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} required disabled={isSubmitting} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required disabled={isSubmitting} />
          </div>
          <div>
            <Label htmlFor="expiresInDays">Expires In (Days)</Label>
            <Input id="expiresInDays" type="number" value={expiresInDays} onChange={(e) => setExpiresInDays(e.target.value)} required disabled={isSubmitting} />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Job Listing'}
          </Button>
        </form>
        {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
      </DialogContent>
    </Dialog>
  )
}


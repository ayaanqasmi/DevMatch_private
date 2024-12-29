'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ResumeFormProps {
  onClose: () => void
  onSuccess: () => void
  token: string
}

export default function ResumeForm({ onClose, onSuccess, token }: ResumeFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!file) {
      setMessage("Please select a PDF file.")
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:4000/api/resume', {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${token}` }
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
          <DialogTitle>Upload Resume</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="file">Select PDF File</Label>
            <Input id="file" type="file" accept="application/pdf" onChange={handleFileChange} disabled={isSubmitting} />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Uploading...' : 'Upload'}
          </Button>
        </form>
        {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
      </DialogContent>
    </Dialog>
  )
}


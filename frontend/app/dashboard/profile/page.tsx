'use client'

import { useEffect, useState } from 'react'
import useUserData from '../../hooks/useUserData'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import UserItems from '@/components/UserItems'


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

export default function ProfilePage() {
  const { userData, loading, error } = useUserData()
  

  return (
    <div className="container mx-auto p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">User Profile</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Name:</strong> {userData?.user.user.username}</p>
          <p><strong>Email:</strong> {userData?.user.user.email}</p>
        </CardContent>
      </Card>
      <UserItems/>
      
    </div>
  )
}

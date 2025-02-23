'use client'

import { useEffect, useState } from 'react'
import { collection, query, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase/firebase'
import Link from 'next/link'
import { addTestEntries } from '@/lib/firebase/firebaseUtils'

interface SoftwareSubmission {
  id: string
  name: string
  description: string
  category: string
  website: string
  pricing: string
  email: string
  status: 'pending' | 'approved' | 'rejected' | 'disabled'
  isFeatured: boolean
  createdAt: any
  isTestData?: boolean
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<SoftwareSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const q = query(collection(db, 'software'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      const submissionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SoftwareSubmission[]
      setSubmissions(submissionsData)
    } catch (err) {
      setError('Error fetching submissions')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected' | 'disabled') => {
    try {
      await updateDoc(doc(db, 'software', id), { status })
      // Refresh the submissions list
      await fetchSubmissions()
    } catch (err) {
      setError('Error updating submission status')
    }
  }

  const handleFeatureToggle = async (id: string, isFeatured: boolean) => {
    try {
      await updateDoc(doc(db, 'software', id), { isFeatured })
      // Refresh the submissions list
      await fetchSubmissions()
    } catch (err) {
      setError('Error updating featured status')
    }
  }

  const handleAddTestData = async () => {
    try {
      const result = await addTestEntries()
      if (result.success) {
        await fetchSubmissions()
      } else {
        setError('Failed to add test entries')
      }
    } catch (err) {
      setError('Error adding test entries')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <button
                onClick={handleAddTestData}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Add Test Data
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                {error}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Software
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Featured
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr key={submission.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {submission.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {submission.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${submission.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            submission.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                            submission.status === 'disabled' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'}`}
                        >
                          {submission.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleFeatureToggle(submission.id, !submission.isFeatured)}
                          className={`px-2 py-1 text-xs rounded
                            ${submission.isFeatured ? 
                              'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 
                              'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                        >
                          {submission.isFeatured ? 'Featured' : 'Not Featured'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded
                          ${submission.isTestData ? 
                            'bg-purple-100 text-purple-800' : 
                            'bg-blue-100 text-blue-800'}`}
                        >
                          {submission.isTestData ? 'Test Data' : 'User Submission'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          {submission.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(submission.id, 'approved')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(submission.id, 'rejected')}
                                className="text-red-600 hover:text-red-900"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {submission.status === 'approved' && (
                            <button
                              onClick={() => handleStatusUpdate(submission.id, 'disabled')}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Disable
                            </button>
                          )}
                          <Link
                            href={`/admin/software/${submission.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 
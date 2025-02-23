'use client'

import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/firebase'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface SoftwareDetails {
  id: string
  name: string
  description: string
  category: string
  website: string
  pricing: string
  features?: string[]
  requirements?: string[]
  documentation?: string
  github?: string
  demo?: string
  screenshots?: string[]
  createdAt: any
  status: string
  isFeatured: boolean
}

export default function SoftwareDetailPage({ params }: { params: { id: string } }) {
  const [software, setSoftware] = useState<SoftwareDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSoftware = async () => {
      try {
        const docRef = doc(db, 'software', params.id)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setSoftware({ id: docSnap.id, ...docSnap.data() } as SoftwareDetails)
        } else {
          setError('Software not found')
        }
      } catch (err) {
        setError('Error fetching software details')
      } finally {
        setLoading(false)
      }
    }

    fetchSoftware()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !software) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Software not found'}
            </h1>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 inline-flex items-center"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 inline-flex items-center mb-8"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Directory
          </Link>

          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{software.name}</h1>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {software.category}
                  </span>
                  {software.isFeatured && (
                    <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              <Link
                href={software.website}
                target="_blank"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Visit Website
              </Link>
            </div>

            <div className="prose max-w-none">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-600">{software.description}</p>
              </div>

              {software.features && software.features.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h2>
                  <ul className="list-disc pl-5 text-gray-600">
                    {software.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {software.requirements && software.requirements.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                  <ul className="list-disc pl-5 text-gray-600">
                    {software.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h2>
                  <p className="text-gray-600">{software.pricing}</p>
                </div>
                {software.documentation && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Documentation</h2>
                    <Link
                      href={software.documentation}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      View Documentation →
                    </Link>
                  </div>
                )}
              </div>

              {software.github && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Source Code</h2>
                  <Link
                    href={software.github}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    View on GitHub →
                  </Link>
                </div>
              )}

              {software.screenshots && software.screenshots.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Screenshots</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {software.screenshots.map((screenshot, index) => (
                      <Image
                        key={index}
                        src={screenshot}
                        alt={`${software.name} screenshot ${index + 1}`}
                        width={500}
                        height={300}
                        className="rounded-lg shadow-sm"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 
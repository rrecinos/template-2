'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getLatestSoftware } from '@/lib/firebase/firebaseUtils'
import { categories } from '@/lib/constants'

interface SoftwareEntry {
  id: string
  name: string
  description: string
  category: string
  website: string
  pricing: string
  isFeatured: boolean
  status: 'pending' | 'approved' | 'rejected' | 'disabled'
  createdAt: any
  email: string
}

export default function Home() {
  const [regularSoftware, setRegularSoftware] = useState<SoftwareEntry[]>([])
  const [featuredSoftware, setFeaturedSoftware] = useState<SoftwareEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredSoftware, setFilteredSoftware] = useState<{
    featured: SoftwareEntry[]
    regular: SoftwareEntry[]
  }>({ featured: [], regular: [] })

  useEffect(() => {
    const fetchSoftware = async () => {
      try {
        console.log('Fetching software listings...')
        setLoading(true)
        
        // Fetch featured software first
        console.log('Fetching featured software...')
        const featured = await getLatestSoftware(true, 3)
        console.log('Featured software:', featured)
        
        // Fetch regular software
        console.log('Fetching regular software...')
        const regular = await getLatestSoftware(false, 6)
        console.log('Regular software:', regular)
        
        setRegularSoftware(regular as SoftwareEntry[])
        setFeaturedSoftware(featured as SoftwareEntry[])
        setFilteredSoftware({
          featured: featured as SoftwareEntry[],
          regular: regular as SoftwareEntry[]
        })
      } catch (error) {
        console.error('Error fetching software:', error)
        setRegularSoftware([])
        setFeaturedSoftware([])
        setFilteredSoftware({ featured: [], regular: [] })
      } finally {
        setLoading(false)
      }
    }

    fetchSoftware()
  }, [])

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSoftware({
        featured: featuredSoftware,
        regular: regularSoftware
      })
      return
    }

    const query = searchQuery.toLowerCase()
    const filteredFeatured = featuredSoftware.filter(software =>
      software.name.toLowerCase().includes(query) ||
      software.description.toLowerCase().includes(query) ||
      software.category.toLowerCase().includes(query)
    )

    const filteredRegular = regularSoftware.filter(software =>
      software.name.toLowerCase().includes(query) ||
      software.description.toLowerCase().includes(query) ||
      software.category.toLowerCase().includes(query)
    )

    setFilteredSoftware({
      featured: filteredFeatured,
      regular: filteredRegular
    })
  }, [searchQuery, featuredSoftware, regularSoftware])

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Find the Perfect Self-Hosted Software
          </h1>
          <p className="text-xl text-center mb-8 text-blue-100">
            Browse through our curated collection of self-hosted software solutions
          </p>
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search software..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700">
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Software */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Featured Software</h2>
          <p className="text-gray-600 mb-8">Premium listings from our verified partners</p>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredSoftware.featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSoftware.featured.map((software) => (
                <div
                  key={software.id}
                  className="bg-white rounded-lg p-6 shadow-md border border-yellow-200"
                >
                  <div className="mb-4">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {software.category}
                    </span>
                    <span className="ml-2 text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                      Featured
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{software.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{software.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{software.pricing}</span>
                    <div className="space-x-4">
                      <Link
                        href={`/software/${software.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Details
                      </Link>
                      <Link
                        href={software.website}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Visit Website →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No featured software available.</p>
          )}
        </div>
      </section>

      {/* Latest Software */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Latest Additions</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredSoftware.regular.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSoftware.regular.map((software) => (
                <div
                  key={software.id}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="mb-4">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {software.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{software.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{software.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{software.pricing}</span>
                    <div className="space-x-4">
                      <Link
                        href={`/software/${software.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Details
                      </Link>
                      <Link
                        href={software.website}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Visit Website →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No software listings available.</p>
          )}
        </div>
      </section>
    </main>
  )
}

'use client'

import { categories } from '@/app/page'
import { useState, FormEvent } from 'react'
import { submitSoftware } from '@/lib/firebase/firebaseUtils'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
  description: string
  count: number
}

export default function SubmitPage() {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('free')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      const websiteUrl = formData.get('website') as string
      const data = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        website: websiteUrl.startsWith('http://') || websiteUrl.startsWith('https://')
          ? websiteUrl
          : `https://${websiteUrl}`,
        pricing: formData.get('pricing') as string,
        email: formData.get('email') as string,
      }

      console.log('Submitting form data:', data)
      const result = await submitSoftware(data)
      console.log('Submission result:', result)
      
      if (result.success) {
        if (selectedPlan === 'premium') {
          console.log('Redirecting to payment page...')
          router.push(`/payment?listing_id=${result.id}`)
        } else {
          console.log('Redirecting to success page...')
          router.push('/submit/success')
        }
      } else {
        console.error('Submission failed:', result.error)
        setError(result.error || 'Failed to submit software. Please try again.')
      }
    } catch (err) {
      console.error('Error during submission:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Your Software</h1>
          <p className="text-gray-600 mb-8">
            List your self-hosted software in our directory and reach thousands of potential users.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Free Listing */}
            <div 
              className={`bg-white rounded-lg p-6 border-2 transition-colors cursor-pointer ${
                selectedPlan === 'free' ? 'border-blue-500' : 'border-gray-200'
              }`}
              onClick={() => setSelectedPlan('free')}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Free Listing</h2>
              <p className="text-gray-600 mb-4">Basic listing for your software</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Basic software information
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Category listing
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Website link
                </li>
              </ul>
              <div className="text-gray-900 font-semibold mb-4">$0 / Free forever</div>
            </div>

            {/* Premium Listing */}
            <div 
              className={`bg-white rounded-lg p-6 border-2 transition-colors cursor-pointer ${
                selectedPlan === 'premium' ? 'border-blue-500' : 'border-gray-200'
              }`}
              onClick={() => setSelectedPlan('premium')}
            >
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-2">
                Recommended
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Premium Listing</h2>
              <p className="text-gray-600 mb-4">Enhanced visibility for your software</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Everything in Free
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Featured placement
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Social media promotion
                </li>
              </ul>
              <div className="text-gray-900 font-semibold mb-4">$49 / one-time fee</div>
            </div>
          </div>

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Software Information</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Software Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="e.g. My Software Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Describe your software's main features and benefits..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category: Category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL *
                </label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  placeholder="example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="pricing" className="block text-sm font-medium text-gray-700 mb-1">
                  Pricing Model *
                </label>
                <select
                  id="pricing"
                  name="pricing"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                >
                  <option value="">Select pricing model</option>
                  <option value="Free">Free</option>
                  <option value="Free / Open Source">Free / Open Source</option>
                  <option value="Free / Enterprise">Free / Enterprise</option>
                  <option value="Paid">Paid</option>
                  <option value="Contact for Pricing">Contact for Pricing</option>
                </select>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting 
                    ? 'Submitting...' 
                    : selectedPlan === 'premium' 
                      ? 'Continue to Payment' 
                      : 'Submit Listing'
                  }
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
} 
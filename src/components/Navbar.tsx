import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            SoftwareDir
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/categories" className="text-gray-600 hover:text-blue-600">
              Categories
            </Link>
            <Link href="/featured" className="text-gray-600 hover:text-blue-600">
              Featured
            </Link>
            <Link href="/new" className="text-gray-600 hover:text-blue-600">
              New Arrivals
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-blue-600">
              Blog
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Submit Software
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 
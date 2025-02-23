import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">About</h3>
            <p className="text-sm">
              SoftwareDir is your trusted source for finding and comparing business software solutions.
              We help businesses make informed decisions about their software needs.
            </p>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/project-management" className="text-sm hover:text-white">
                  Project Management
                </Link>
              </li>
              <li>
                <Link href="/categories/crm" className="text-sm hover:text-white">
                  CRM Software
                </Link>
              </li>
              <li>
                <Link href="/categories/accounting" className="text-sm hover:text-white">
                  Accounting
                </Link>
              </li>
              <li>
                <Link href="/categories/marketing" className="text-sm hover:text-white">
                  Marketing Tools
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-sm hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-sm hover:text-white">
                  Buying Guides
                </Link>
              </li>
              <li>
                <Link href="/comparisons" className="text-sm hover:text-white">
                  Comparisons
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-sm hover:text-white">
                  Reviews
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-sm hover:text-white">
                  Submit Software
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="text-sm hover:text-white">
                  Advertise
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} SoftwareDir. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 
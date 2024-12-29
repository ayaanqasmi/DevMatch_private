import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="py-8 px-4 md:px-6 bg-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <Link href="/" className="text-xl font-semibold text-purple-600">DevMatch</Link>
          <p className="text-sm text-gray-600 mt-1">© 2023 DevMatch. All rights reserved.</p>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/privacy" className="text-sm text-gray-600 hover:text-purple-600">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-sm text-gray-600 hover:text-purple-600">Terms of Service</Link></li>
            <li><Link href="/contact" className="text-sm text-gray-600 hover:text-purple-600">Contact Us</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}

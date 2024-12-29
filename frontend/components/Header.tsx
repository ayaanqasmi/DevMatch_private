import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="py-4 px-4 md:px-6 flex justify-between items-center bg-white shadow-sm">
      <Link href="/" className="text-2xl font-bold text-purple-600">DevMatch</Link>
      <nav>
        <ul className="flex space-x-4">
          <li><Link href="/about" className="text-gray-600 hover:text-purple-600">About</Link></li>
          <li><Link href="/features" className="text-gray-600 hover:text-purple-600">Features</Link></li>
          <li><Link href="/pricing" className="text-gray-600 hover:text-purple-600">Pricing</Link></li>
          <li><Button asChild variant="outline" size="sm"><Link href="/login">Login</Link></Button></li>
          <li><Button asChild size="sm"><Link href="/register">Register</Link></Button></li>
        </ul>
      </nav>
    </header>
  )
}


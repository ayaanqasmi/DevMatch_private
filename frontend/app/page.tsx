import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, Code, Users, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="py-20 px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
            Welcome to DevMatch
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-600 max-w-2xl mx-auto">
            Connecting talented developers with top recruiters, streamlining the hiring process.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/register">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </section>

        <section className="py-16 px-4 md:px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Code className="h-10 w-10 text-purple-600" />}
              title="For Developers"
              description="Showcase your skills and get matched with exciting opportunities."
            />
            <FeatureCard 
              icon={<Users className="h-10 w-10 text-blue-600" />}
              title="For Recruiters"
              description="Find the perfect candidates for your tech positions quickly and efficiently."
            />
            <FeatureCard 
              icon={<Zap className="h-10 w-10 text-green-600" />}
              title="Streamlined Process"
              description="Our AI-powered matching system saves time and improves hiring outcomes."
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button/Button'
import { FiHome, FiArrowLeft } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-base-content mb-2">
            Page Not Found
          </h2>
          <p className="text-base-content/70">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="w-full"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          
          <Link href="/">
            <Button variant="primary" className="w-full">
              <FiHome className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
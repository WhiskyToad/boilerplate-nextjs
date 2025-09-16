'use client'

import { useState } from 'react'
import { OnboardingStepProps } from '../OnboardingProvider'
import { useAuth } from '@/hooks/useAuth'
import { FileUpload } from '@/components/ui/file-upload/FileUpload'
import { FiUser, FiMail, FiImage } from 'react-icons/fi'

export function ProfileSetupStep({ onComplete }: OnboardingStepProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    displayName: user?.user_metadata?.full_name || '',
    bio: '',
    avatarUrl: user?.user_metadata?.avatar_url || '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Here you would update the user profile
      // For now, we'll just simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onComplete()
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = async (files: File[]) => {
    // Handle avatar upload
    if (files.length > 0) {
      console.log('Avatar uploaded:', files[0])
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiUser className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">Set up your profile</h3>
        <p className="text-base-content/70">
          Tell us a bit about yourself to personalize your experience.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload */}
        <div className="text-center">
          <label className="block text-sm font-medium mb-2">Profile Photo</label>
          <div className="flex justify-center">
            <FileUpload
              variant="avatar"
              onUpload={handleAvatarUpload}
              className="w-24 h-24"
            />
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <FiUser className="w-4 h-4 inline mr-1" />
            Display Name
          </label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            className="input input-bordered w-full"
            placeholder="Your display name"
            required
          />
        </div>

        {/* Email (readonly) */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <FiMail className="w-4 h-4 inline mr-1" />
            Email
          </label>
          <input
            type="email"
            value={user?.email || ''}
            className="input input-bordered w-full"
            disabled
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Bio (optional)
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="textarea textarea-bordered w-full"
            placeholder="Tell us about yourself..."
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !formData.displayName}
          className="btn btn-primary w-full"
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            'Complete Profile Setup'
          )}
        </button>
      </form>
    </div>
  )
}
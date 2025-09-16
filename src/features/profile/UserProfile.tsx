'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useProfile, useUpdateProfile } from '@/hooks/useProfile'
import { Button } from '@/components/ui/button/Button'
import { Input } from '@/components/ui/input/Input'
import { Card, CardContent, CardHeader } from '@/components/ui/card/Card'
import { FileUpload } from '@/components/ui/file-upload/FileUpload'
import { useToast } from '@/hooks/useToast'
import { useFileUpload } from '@/hooks/useFileUpload'

interface ProfileFormData {
  display_name: string
  avatar_url?: string
}

export function UserProfile() {
  const { data: profile, isLoading, refetch } = useProfile()
  const { mutate: updateProfile, isPending } = useUpdateProfile()
  const { uploadAvatar, isUploading } = useFileUpload()
  const { toast } = useToast()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset
  } = useForm<ProfileFormData>({
    defaultValues: {
      display_name: profile?.display_name || '',
      avatar_url: profile?.avatar_url || '',
    },
  })

  // Reset form when profile data loads
  React.useEffect(() => {
    if (profile) {
      reset({
        display_name: profile.display_name || '',
        avatar_url: profile.avatar_url || '',
      })
    }
  }, [profile, reset])

  const onSubmit = (data: ProfileFormData) => {
    updateProfile(data, {
      onSuccess: () => {
        toast.success('Profile updated successfully!')
        reset(data) // Reset form dirty state
      },
      onError: (error) => {
        toast.error(`Error updating profile: ${error.message}`)
      },
    })
  }

  const handleAvatarUpload = async (files: File[]) => {
    if (files.length === 0) return

    const result = await uploadAvatar(files[0])
    if (result.success) {
      toast.success('Avatar updated successfully!')
      refetch() // Refresh profile data
    } else {
      toast.error(`Avatar upload failed: ${result.error}`)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Profile</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Profile</h2>
        <p className="text-base-content/70">
          Manage your account settings and preferences.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Upload */}
          <div>
            <label className="label">
              <span className="label-text">Profile Picture</span>
            </label>
            <div className="flex items-center gap-4">
              {profile?.avatar_url && (
                <div className="avatar">
                  <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img 
                      src={profile.avatar_url} 
                      alt="Current avatar"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                </div>
              )}
              <FileUpload
                onUpload={handleAvatarUpload}
                accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] }}
                maxSize={5 * 1024 * 1024} // 5MB
                variant="avatar"
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <Input
              type="email"
              value={profile?.email || ''}
              disabled
              className="bg-base-200"
            />
            <div className="label">
              <span className="label-text-alt text-base-content/60">
                Email cannot be changed
              </span>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="label">
              <span className="label-text">Display Name</span>
            </label>
            <Input
              {...register('display_name', {
                required: 'Display name is required',
                minLength: {
                  value: 2,
                  message: 'Display name must be at least 2 characters',
                },
              })}
              placeholder="Enter your display name"
              error={errors.display_name?.message}
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label className="label">
              <span className="label-text">Avatar URL</span>
            </label>
            <Input
              {...register('avatar_url')}
              type="url"
              placeholder="https://example.com/avatar.jpg"
              error={errors.avatar_url?.message}
            />
            <div className="label">
              <span className="label-text-alt text-base-content/60">
                Optional: Link to your profile picture
              </span>
            </div>
          </div>


          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              loading={isPending}
              disabled={!isDirty || isPending}
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
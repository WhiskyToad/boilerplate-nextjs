'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export interface UploadOptions {
  endpoint: string
  folder?: string
  onProgress?: (progress: number) => void
}

export interface UploadResult {
  success: boolean
  url?: string
  path?: string
  error?: string
}

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { user } = useAuth()

  const uploadFile = async (file: File, options: UploadOptions): Promise<UploadResult> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    setIsUploading(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (options.folder) {
        formData.append('folder', options.folder)
      }

      const { data: { session } } = await import('@/lib/supabase/client').then(m => m.supabase.auth.getSession())
      
      if (!session?.access_token) {
        throw new Error('No valid session')
      }

      const response = await fetch(options.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      if (options.onProgress) {
        options.onProgress(100)
      }
      setProgress(100)

      return {
        success: true,
        url: result.data.url,
        path: result.data.path
      }

    } catch (error) {
      console.error('Upload error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    } finally {
      setIsUploading(false)
    }
  }

  const uploadAvatar = async (file: File): Promise<UploadResult> => {
    return uploadFile(file, { endpoint: '/api/upload/avatar' })
  }

  const uploadDocument = async (file: File, folder?: string): Promise<UploadResult> => {
    return uploadFile(file, { endpoint: '/api/upload/document', folder })
  }

  const uploadImage = async (file: File, folder?: string): Promise<UploadResult> => {
    return uploadFile(file, { endpoint: '/api/upload/image', folder })
  }

  const uploadMultiple = async (
    files: File[], 
    uploadFunction: (file: File) => Promise<UploadResult>
  ): Promise<UploadResult[]> => {
    const results: UploadResult[] = []
    
    for (let i = 0; i < files.length; i++) {
      const result = await uploadFunction(files[i])
      results.push(result)
      setProgress((i + 1) / files.length * 100)
    }
    
    return results
  }

  return {
    uploadFile,
    uploadAvatar,
    uploadDocument,
    uploadImage,
    uploadMultiple,
    isUploading,
    progress
  }
}
import { NextRequest } from 'next/server'
import { withRateLimitAuth, apiResponse, apiError } from '@/lib/api/middleware'
import { storage } from '@/lib/storage/supabase-storage'

export const POST = withRateLimitAuth(async (request, user) => {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'documents'

    if (!file) {
      return apiError('No file provided', 400)
    }

    // Upload document to storage
    const uploadResult = await storage.uploadDocument(user.id, file, folder)

    if (!uploadResult.success) {
      return apiError(uploadResult.error || 'Upload failed', 400)
    }

    return apiResponse({
      url: uploadResult.url,
      path: uploadResult.path,
      name: file.name,
      size: file.size,
      type: file.type
    }, 'Document uploaded successfully')

  } catch (error) {
    console.error('Document upload error:', error)
    return apiError('Upload failed', 500)
  }
}, 30) // 30 uploads per minute
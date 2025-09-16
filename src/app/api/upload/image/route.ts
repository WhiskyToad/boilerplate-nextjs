import { NextRequest } from 'next/server'
import { withRateLimitAuth, apiResponse, apiError } from '@/lib/api/middleware'
import { storage } from '@/lib/storage/supabase-storage'

export const POST = withRateLimitAuth(async (request, user) => {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'images'

    if (!file) {
      return apiError('No file provided', 400)
    }

    // Upload image to storage
    const uploadResult = await storage.uploadImage(user.id, file, folder)

    if (!uploadResult.success) {
      return apiError(uploadResult.error || 'Upload failed', 400)
    }

    return apiResponse({
      url: uploadResult.url,
      path: uploadResult.path,
      name: file.name,
      size: file.size,
      type: file.type
    }, 'Image uploaded successfully')

  } catch (error) {
    console.error('Image upload error:', error)
    return apiError('Upload failed', 500)
  }
}, 50) // 50 uploads per minute
import { NextRequest } from 'next/server'
import { withAuth, apiResponse, apiError } from '@/lib/api/middleware'
import { storage } from '@/lib/storage/supabase-storage'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const POST = withAuth(async (request, user) => {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return apiError('No file provided', 400)
    }

    // Upload avatar to storage
    const uploadResult = await storage.uploadAvatar(user.id, file)

    if (!uploadResult.success) {
      return apiError(uploadResult.error || 'Upload failed', 400)
    }

    // Update user profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: uploadResult.url })
      .eq('id', user.id)

    if (updateError) {
      // Clean up uploaded file if profile update fails
      if (uploadResult.path) {
        await storage.deleteFile('avatars', uploadResult.path)
      }
      return apiError('Failed to update profile', 500)
    }

    return apiResponse({
      url: uploadResult.url,
      path: uploadResult.path
    }, 'Avatar updated successfully')

  } catch (error) {
    console.error('Avatar upload error:', error)
    return apiError('Upload failed', 500)
  }
})
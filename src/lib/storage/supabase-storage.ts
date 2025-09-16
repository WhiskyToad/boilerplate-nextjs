import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface UploadOptions {
  bucket: string
  path: string
  file: File | Buffer
  contentType?: string
  cacheControl?: string
  upsert?: boolean
}

export interface UploadResult {
  success: boolean
  url?: string
  path?: string
  error?: string
}

class SupabaseStorage {
  // Default buckets
  static readonly BUCKETS = {
    AVATARS: 'avatars',
    DOCUMENTS: 'documents', 
    IMAGES: 'images',
    EXPORTS: 'exports'
  } as const

  async createBucket(name: string, isPublic: boolean = false) {
    const { data, error } = await supabase.storage.createBucket(name, {
      public: isPublic,
      allowedMimeTypes: isPublic ? ['image/*'] : undefined,
      fileSizeLimit: isPublic ? 5 * 1024 * 1024 : 50 * 1024 * 1024, // 5MB for public, 50MB for private
    })

    if (error) {
      console.error(`Failed to create bucket ${name}:`, error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  }

  async uploadFile(options: UploadOptions): Promise<UploadResult> {
    const { bucket, path, file, contentType, cacheControl = '3600', upsert = false } = options

    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          contentType,
          cacheControl,
          upsert,
        })

      if (error) {
        console.error('Upload error:', error)
        return { success: false, error: error.message }
      }

      // Get public URL for public buckets
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)

      return {
        success: true,
        url: urlData.publicUrl,
        path: data.path
      }
    } catch (error) {
      console.error('Storage upload error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      }
    }
  }

  async uploadAvatar(userId: string, file: File): Promise<UploadResult> {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'Only image files are allowed for avatars' }
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'Avatar file size must be less than 5MB' }
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}.${fileExt}`
    const filePath = `${userId}/${fileName}`

    return this.uploadFile({
      bucket: SupabaseStorage.BUCKETS.AVATARS,
      path: filePath,
      file,
      contentType: file.type,
      upsert: true // Allow overwriting existing avatar
    })
  }

  async uploadDocument(userId: string, file: File, folder?: string): Promise<UploadResult> {
    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      return { success: false, error: 'Document file size must be less than 50MB' }
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${file.name}`
    const filePath = folder 
      ? `${userId}/${folder}/${fileName}`
      : `${userId}/${fileName}`

    return this.uploadFile({
      bucket: SupabaseStorage.BUCKETS.DOCUMENTS,
      path: filePath,
      file,
      contentType: file.type
    })
  }

  async uploadImage(userId: string, file: File, folder?: string): Promise<UploadResult> {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'Only image files are allowed' }
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: 'Image file size must be less than 10MB' }
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${file.name}`
    const filePath = folder 
      ? `${userId}/${folder}/${fileName}`
      : `${userId}/${fileName}`

    return this.uploadFile({
      bucket: SupabaseStorage.BUCKETS.IMAGES,
      path: filePath,
      file,
      contentType: file.type
    })
  }

  async deleteFile(bucket: string, path: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Delete failed' 
      }
    }
  }

  async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<{ url?: string; error?: string }> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn)

      if (error) {
        return { error: error.message }
      }

      return { url: data.signedUrl }
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Failed to create signed URL' 
      }
    }
  }

  async listFiles(bucket: string, folder?: string, limit?: number): Promise<{ files?: any[]; error?: string }> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder, {
          limit,
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (error) {
        return { error: error.message }
      }

      return { files: data }
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Failed to list files' 
      }
    }
  }
}

export const storage = new SupabaseStorage()
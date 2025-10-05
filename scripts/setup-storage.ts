// Script to set up Supabase storage buckets
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Read .env.local file
const envPath = path.join(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')

// Parse environment variables
function getEnvVar(name: string): string {
  const match = envContent.match(new RegExp(`^${name}=(.*)$`, 'm'))
  return match ? match[1].trim() : ''
}

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL')
const supabaseServiceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY')

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorageBuckets() {
  console.log('🚀 Setting up storage buckets...\n')

  // Define buckets
  const buckets = [
    {
      id: 'images',
      name: 'images',
      public: true,
      fileSizeLimit: 10 * 1024 * 1024, // 10MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    },
    {
      id: 'avatars',
      name: 'avatars',
      public: true,
      fileSizeLimit: 5 * 1024 * 1024, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    },
    {
      id: 'documents',
      name: 'documents',
      public: false,
      fileSizeLimit: 50 * 1024 * 1024, // 50MB
    },
    {
      id: 'exports',
      name: 'exports',
      public: false,
      fileSizeLimit: 100 * 1024 * 1024, // 100MB
    }
  ]

  for (const bucket of buckets) {
    console.log(`Creating bucket: ${bucket.name}...`)

    const { data, error } = await supabase.storage.createBucket(bucket.id, {
      public: bucket.public,
      fileSizeLimit: bucket.fileSizeLimit,
      allowedMimeTypes: bucket.allowedMimeTypes
    })

    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`✓ Bucket '${bucket.name}' already exists`)
      } else {
        console.error(`✗ Failed to create bucket '${bucket.name}':`, error.message)
      }
    } else {
      console.log(`✓ Created bucket '${bucket.name}'`)
    }
  }

  console.log('\n✅ Storage setup complete!')
  console.log('\nBuckets created:')
  console.log('  - images (public, 10MB) - for demo screenshots')
  console.log('  - avatars (public, 5MB) - for user avatars')
  console.log('  - documents (private, 50MB) - for user documents')
  console.log('  - exports (private, 100MB) - for demo exports')
}

setupStorageBuckets().catch(error => {
  console.error('❌ Error:', error)
  process.exit(1)
})

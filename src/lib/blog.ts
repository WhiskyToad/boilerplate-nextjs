import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  publishDate: string
  lastEdited: string
  published: boolean
  category?: string
  tags: string[]
  seoTitle?: string
  seoDescription?: string
  featuredImage?: string
  author?: string
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')

/**
 * Get all blog posts from markdown files
 */
export async function getBlogPosts(includeUnpublished = false): Promise<BlogPost[]> {
  // Check if content directory exists
  if (!fs.existsSync(CONTENT_DIR)) {
    console.warn('Blog content directory not found at:', CONTENT_DIR)
    return []
  }

  try {
    const files = fs.readdirSync(CONTENT_DIR)
      .filter(file => file.endsWith('.md') && file !== 'README.md')

    const posts = files.map(file => {
      const slug = file.replace(/\.md$/, '')
      const filePath = path.join(CONTENT_DIR, file)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || slug,
        excerpt: data.excerpt || '',
        content,
        publishDate: data.publishDate || data.date || new Date().toISOString(),
        lastEdited: data.lastEdited || data.publishDate || data.date || new Date().toISOString(),
        published: data.published !== false, // Default to true
        category: data.category,
        tags: Array.isArray(data.tags) ? data.tags : [],
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        featuredImage: data.featuredImage,
        author: data.author || 'SaaS Team',
      } as BlogPost
    })

    // Filter by published status
    const filteredPosts = includeUnpublished ? posts : posts.filter(post => post.published)

    // Sort by publish date (newest first)
    return filteredPosts.sort((a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    )
  } catch (error) {
    console.error('Error reading blog posts:', error)
    return []
  }
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || slug,
      excerpt: data.excerpt || '',
      content,
      publishDate: data.publishDate || data.date || new Date().toISOString(),
      lastEdited: data.lastEdited || data.publishDate || data.date || new Date().toISOString(),
      published: data.published !== false,
      category: data.category,
      tags: Array.isArray(data.tags) ? data.tags : [],
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      featuredImage: data.featuredImage,
      author: data.author || 'SaaS Team',
    } as BlogPost
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error)
    return null
  }
}

/**
 * Get blog posts by category
 */
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  const allPosts = await getBlogPosts()
  return allPosts.filter(post =>
    post.category?.toLowerCase() === category.toLowerCase()
  )
}

/**
 * Get blog posts by tag
 */
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const allPosts = await getBlogPosts()
  return allPosts.filter(post =>
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  )
}

/**
 * Get all categories
 */
export async function getAllCategories(): Promise<string[]> {
  const allPosts = await getBlogPosts()
  const categories = allPosts
    .map(post => post.category)
    .filter((category): category is string => Boolean(category))
  return [...new Set(categories)]
}

/**
 * Get all tags
 */
export async function getAllTags(): Promise<string[]> {
  const allPosts = await getBlogPosts()
  const tags = allPosts.flatMap(post => post.tags)
  return [...new Set(tags)]
}

/**
 * Generate excerpt from content
 */
export function generateExcerpt(content: string, length = 160): string {
  // Remove markdown syntax for excerpt
  const plainText = content
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/`(.*?)`/g, '$1') // Remove code
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim()

  if (plainText.length <= length) {
    return plainText
  }

  return plainText.substring(0, length).trim() + '...'
}

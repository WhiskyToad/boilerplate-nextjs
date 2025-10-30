import { MetadataRoute } from 'next'
import { getBlogPosts, getAllCategories, getAllTags } from '@/lib/blog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // Blog posts
  const posts = await getBlogPosts()
  const blogPosts = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.lastEdited),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Category pages
  const categories = await getAllCategories()
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/blog/category/${category.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  // Tag pages
  const tags = await getAllTags()
  const tagPages = tags.map((tag) => ({
    url: `${baseUrl}/blog/tag/${tag.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.4,
  }))

  return [...staticPages, ...blogPosts, ...categoryPages, ...tagPages]
}

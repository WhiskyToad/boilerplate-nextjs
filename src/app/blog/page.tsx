import { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts, generateExcerpt } from "@/lib/blog";
import { BlogLayout } from "@/features/blog/BlogLayout";
import { FiCalendar, FiClock } from "react-icons/fi";
import { siteConfig } from "@/config/site-config";

export const metadata: Metadata = {
  title: `Blog - ${siteConfig.name}`,
  description: "Learn about building SaaS products, best practices, and development tips.",
  openGraph: {
    title: `Blog - ${siteConfig.name}`,
    description: "Learn about building SaaS products, best practices, and development tips.",
  },
};

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  const featuredPost = posts.find(post => post.tags.includes("featured")) || posts[0];
  const otherPosts = posts.filter(post => post.slug !== featuredPost?.slug);

  return (
    <BlogLayout>
      <div className="max-w-none">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-base-content mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Blog
            </h1>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
              Learn about building SaaS products, best practices, and development tips that will help you ship faster.
            </p>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-20">
            <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-2xl overflow-hidden shadow-2xl border border-primary/20">
              <div className="p-8 lg:p-12 space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-base-content leading-tight">
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {featuredPost.title}
                  </Link>
                </h2>

                <p className="text-base-content/80 text-lg leading-relaxed">
                  {featuredPost.excerpt || generateExcerpt(featuredPost.content, 200)}
                </p>

                <div className="flex items-center gap-6 text-sm text-base-content/60">
                  {featuredPost.publishDate && (
                    <span className="flex items-center gap-2">
                      <FiCalendar className="w-4 h-4" />
                      {formatDate(featuredPost.publishDate)}
                    </span>
                  )}
                  <span className="flex items-center gap-2">
                    <FiClock className="w-4 h-4" />
                    {getReadingTime(featuredPost.content)} min read
                  </span>
                </div>

                <div className="pt-4">
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Read Full Article →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {otherPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-8 text-base-content">Latest Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <article key={post.slug} className="group card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-300/50 hover:border-primary/30">
                  <div className="card-body p-6">
                    <h3 className="card-title text-lg leading-tight mb-3">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-primary transition-colors line-clamp-2"
                      >
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-base-content/70 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt || generateExcerpt(post.content, 120)}
                    </p>

                    <div className="flex items-center justify-between text-xs text-base-content/60 mb-4">
                      <div className="flex items-center gap-4">
                        {post.publishDate && (
                          <span className="flex items-center gap-1">
                            <FiCalendar className="w-3 h-3" />
                            {formatDate(post.publishDate)}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          {getReadingTime(post.content)} min
                        </span>
                      </div>
                    </div>

                    <div className="card-actions justify-end">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="btn btn-primary btn-sm group-hover:btn-secondary transition-colors"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {posts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-base-content mb-2">
              No blog posts yet
            </h3>
            <p className="text-base-content/70 mb-4">
              Check back soon for insights on building SaaS products!
            </p>
            {process.env.NODE_ENV === 'development' && (
              <div className="text-sm text-base-content/60 bg-base-200 p-4 rounded-lg max-w-md mx-auto">
                <p className="font-medium mb-2">Development Setup:</p>
                <ol className="text-left space-y-1">
                  <li>1. Create markdown files in content/blog/</li>
                  <li>2. Add frontmatter with title, date, excerpt, and tags</li>
                  <li>3. Restart the development server</li>
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
    </BlogLayout>
  );
}

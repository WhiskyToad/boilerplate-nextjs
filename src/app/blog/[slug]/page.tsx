import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts } from "@/lib/blog";
import { BlogLayout } from "@/features/blog/BlogLayout";
import { MarkdownRenderer } from "@/features/blog/MarkdownRenderer";
import { FiCalendar, FiClock } from "react-icons/fi";
import { siteConfig } from "@/config/site-config";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: `Post Not Found - ${siteConfig.name}`,
    };
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || `Read ${post.title} on the ${siteConfig.name} blog.`;

  return {
    title: `${title} - ${siteConfig.name}`,
    description,
    keywords: post.tags.join(", "),
    authors: post.author ? [{ name: post.author }] : undefined,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishDate,
      modifiedTime: post.lastEdited,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  };
}

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

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post || !post.published) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    datePublished: post.publishDate,
    dateModified: post.lastEdited,
    author: {
      "@type": "Person",
      name: post.author || siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo/icon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${slug}`,
    },
  };

  return (
    <BlogLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-16">
          {/* Title */}
          <h1 className="text-4xl lg:text-6xl font-bold text-base-content mb-8 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl lg:text-2xl text-base-content/80 mb-8 leading-relaxed max-w-4xl">
              {post.excerpt}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-8 text-base text-base-content/70 mb-10 p-6 bg-base-200/50 rounded-xl border border-base-300/50">
            {post.author && (
              <span className="font-semibold flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">
                    {post.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                By {post.author}
              </span>
            )}
            {post.publishDate && (
              <span className="flex items-center gap-2">
                <FiCalendar className="w-5 h-5 text-primary" />
                {formatDate(post.publishDate)}
              </span>
            )}
            <span className="flex items-center gap-2">
              <FiClock className="w-5 h-5 text-primary" />
              {getReadingTime(post.content)} min read
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <MarkdownRenderer content={post.content} />
        </div>
      </article>
    </BlogLayout>
  );
}

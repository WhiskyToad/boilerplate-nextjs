# Blog Posts

This directory contains your blog posts in markdown format.

## Creating a New Blog Post

1. Create a new `.md` file in this directory
2. Add frontmatter at the top with metadata
3. Write your content in markdown
4. Restart the development server to see your post

## Frontmatter Example

```markdown
---
title: "Your Blog Post Title"
excerpt: "A brief summary of your post (used in listings and meta descriptions)"
publishDate: "2025-01-15"
lastEdited: "2025-01-15"
published: true
category: "Development"
tags: ["nextjs", "saas", "featured"]
seoTitle: "SEO-optimized title"
seoDescription: "SEO-optimized description"
author: "Author Name"
---
```

## Frontmatter Fields

- **title** (required): The title of your blog post
- **excerpt** (optional): Short summary shown in blog listings
- **publishDate** (required): Publication date in YYYY-MM-DD format
- **lastEdited** (optional): Last edited date in YYYY-MM-DD format
- **published** (optional): Set to `false` to hide post. Defaults to `true`
- **category** (optional): Category for organizing posts
- **tags** (optional): Array of tags. Use "featured" to highlight on blog index
- **seoTitle** (optional): Custom title for SEO (defaults to title)
- **seoDescription** (optional): Custom description for SEO (defaults to excerpt)
- **author** (optional): Author name (defaults to site name)

## Markdown Features

Supports standard markdown plus:

- **Headers**: # H1, ## H2, ### H3
- **Bold**: **text**
- **Inline code**: `code`
- **Code blocks**: \`\`\`language
- **Links**: [text](url)
- **Lists**: - item or 1. item

## Featured Posts

Add "featured" to the tags array to display a post prominently on the blog index page.

## File Naming

Use kebab-case for file names:
- ✅ `getting-started-with-nextjs.md`
- ❌ `Getting Started With NextJS.md`

## SEO

The blog system automatically:
- Generates sitemap entries for all published posts
- Creates proper meta tags and Open Graph data
- Adds JSON-LD structured data
- Generates category and tag pages

## Example Post

See `getting-started-with-nextjs.md` for a complete example.

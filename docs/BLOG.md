# Blog System Guide

Your boilerplate includes a production-ready markdown blog system with automatic SEO optimization.

## Overview

The blog system is:
- **File-based** - Write posts in markdown files
- **SEO-optimized** - Automatic sitemaps, meta tags, and structured data
- **Zero-config** - Just drop markdown files and go
- **Fast** - Static generation for instant page loads

## Quick Start

### 1. Create a Blog Post

Create a new `.md` file in `content/blog/`:

```markdown
---
title: "My First Blog Post"
excerpt: "A short summary of the post"
publishDate: "2025-01-15"
published: true
category: "Tutorial"
tags: ["nextjs", "featured"]
author: "Your Name"
---

# My First Blog Post

Write your content here in markdown...

## Headings work

- So do lists
- And everything else

```javascript
// Code blocks too!
const hello = "world";
```
```

### 2. View Your Post

Visit `http://localhost:3000/blog` to see your post in the listing.

The URL will be: `http://localhost:3000/blog/my-first-blog-post`

## Frontmatter Options

Every blog post needs frontmatter (the stuff between `---` at the top).

### Required Fields

```yaml
title: "Your Post Title"           # Main title
publishDate: "2025-01-15"          # YYYY-MM-DD format
published: true                     # Set to false to hide
```

### Optional Fields

```yaml
excerpt: "Brief summary"            # Shows in listings and SEO
lastEdited: "2025-01-20"           # When you last updated
category: "Development"            # Organize by category
tags: ["nextjs", "featured"]       # Array of tags
seoTitle: "Custom SEO title"       # Override title for SEO
seoDescription: "Custom desc"      # Override excerpt for SEO
featuredImage: "/images/post.jpg"  # Hero image (optional)
author: "Your Name"                # Post author
```

### Special Tags

**Featured Posts**: Add `"featured"` to the tags array to highlight a post on the blog homepage:

```yaml
tags: ["nextjs", "featured", "tutorial"]
```

## Markdown Features

The blog supports standard markdown plus some extras:

### Headings

```markdown
# H1 Heading
## H2 Heading
### H3 Heading
```

### Text Formatting

```markdown
**bold text**
*italic text*
`inline code`
[link text](https://example.com)
```

### Code Blocks

Use triple backticks with a language:

````markdown
```javascript
function hello() {
  console.log("Hello, world!");
}
```
````

The code block will have:
- Syntax highlighting
- Copy button on hover
- Language badge

### Lists

```markdown
- Unordered list
- Another item

1. Ordered list
2. Another item
```

### Images

```markdown
![Alt text](/images/my-image.jpg)
```

Place images in `public/images/` folder.

## SEO Features

The blog system automatically handles SEO:

### Automatic Sitemap

Every published post is added to `sitemap.xml`:
- Proper priority settings
- Last modified dates
- Category and tag pages

### Meta Tags

Each post gets:
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card tags
- Canonical URLs
- Description meta tags

### Structured Data

JSON-LD markup is added automatically:
- Article schema
- Author information
- Publish/modified dates
- Organization details

### robots.txt

The blog is configured in `robots.txt` to allow crawling while blocking admin routes.

## File Organization

```
content/blog/
├── getting-started-with-nextjs.md    # Your posts
├── another-post.md
└── README.md                          # Setup instructions

public/images/blog/                    # Blog images (optional)
├── post-1.jpg
└── post-2.jpg
```

### File Naming

Use kebab-case for URLs:
- ✅ `getting-started-with-nextjs.md` → `/blog/getting-started-with-nextjs`
- ❌ `Getting Started With NextJS.md`

## Blog Routes

The blog system includes these routes:

- `/blog` - Blog homepage with listings
- `/blog/[slug]` - Individual blog post
- Future: `/blog/category/[category]` - Posts by category
- Future: `/blog/tag/[tag]` - Posts by tag

## Customization

### Styling

The blog uses Tailwind CSS with the typography plugin. To customize:

**Blog Layout**: Edit `src/features/blog/BlogLayout.tsx`
**Markdown Styles**: Edit `src/features/blog/MarkdownRenderer.tsx`
**Blog Index**: Edit `src/app/blog/page.tsx`

### Site Configuration

Update blog metadata in `src/config/site-config.ts`:

```typescript
export const siteConfig = {
  name: "Your SaaS",
  description: "Your description",
  // Used in blog meta tags and structured data
}
```

## Development Tips

### Preview Drafts

Set `published: false` in frontmatter to hide posts:

```yaml
published: false  # Won't show on site
```

### Reading Time

Reading time is calculated automatically:
- Based on 200 words per minute
- Displayed on blog index and post pages

### Excerpt Generation

If you don't provide an `excerpt`, one is generated automatically from the first ~160 characters of content.

### Blog Categories

Organize posts with categories:

```yaml
category: "Tutorial"  # or "Development", "Product", etc.
```

Future versions will include category listing pages.

## Example Post Template

Copy this template for new posts:

```markdown
---
title: "Your Post Title Here"
excerpt: "A compelling summary that makes people want to read more. Keep it under 160 characters for SEO."
publishDate: "2025-01-15"
lastEdited: "2025-01-15"
published: true
category: "Tutorial"
tags: ["nextjs", "saas"]
seoTitle: "Your Post Title - Your SaaS Name"
seoDescription: "Longer SEO description with keywords you want to rank for."
author: "Your Name"
---

# Your Post Title Here

Your introduction paragraph goes here. Make it engaging!

## Main Section

Content goes here...

### Subsection

More content...

## Code Example

```typescript
// Show some code
const example = "like this";
```

## Conclusion

Wrap it up nicely.
```

## Common Questions

**Q: How do I add images to posts?**
A: Place images in `public/images/blog/` and reference them:
```markdown
![Description](/images/blog/my-image.jpg)
```

**Q: Can I use React components in posts?**
A: Not directly. The blog uses markdown only. For interactive content, create a dedicated page.

**Q: How do I change the blog URL?**
A: The blog is at `/blog` by default. To change it, rename `src/app/blog/` to your preferred path.

**Q: Where are blog posts stored?**
A: In the `content/blog/` directory at your project root. They're separate from your code.

**Q: How do I add syntax highlighting themes?**
A: Edit the code block styles in `src/features/blog/MarkdownRenderer.tsx`.

## Production Checklist

Before deploying:

- [ ] Remove example posts from `content/blog/`
- [ ] Add your own posts with real content
- [ ] Update `siteConfig` with your site details
- [ ] Test all posts render correctly
- [ ] Check `/sitemap.xml` includes your posts
- [ ] Verify Open Graph tags with [opengraph.xyz](https://www.opengraph.xyz/)
- [ ] Test Twitter Cards with [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## Performance

The blog is optimized for speed:
- **Static Generation** - Posts are pre-rendered at build time
- **Automatic Code Splitting** - Blog code is loaded only when needed
- **Optimized Images** - Use Next.js Image component for blog images
- **No Client-Side Fetching** - Everything is server-rendered

## What's Next?

Planned features for future updates:
- Category listing pages
- Tag listing pages
- Blog search
- Related posts
- RSS feed
- Post series/collections

Have questions? Check the [main documentation](/dev/docs/readme) or [open an issue](https://github.com/yourusername/your-repo/issues).

// eslint-disable-next-line @typescript-eslint/no-require-imports
const getSiteConfig = require("../utils/siteConfig").default;

// Get configuration
const config = getSiteConfig();
const EXTERNAL_DATA_URL = config.get("site.domain", "{YOUR_DOMAIN}");

// List your site's static pages here
const staticPages = [
  "/",
  "/login",
  "/register",
  "/pricing",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  // Add other static pages as needed
];

function generateSiteMap(pages) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${pages
       .map((page) => {
         const path =
           page.endsWith("/") && page.length > 1 ? page.slice(0, -1) : page; // Remove trailing slash for non-root
         const url = `${EXTERNAL_DATA_URL}${path}`;
         // Assign priorities based on importance (adjust as needed)
         const priority = path === "/" ? "1.0" : "0.8";
         return `
       <url>
           <loc>${url}</loc>
           <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>${priority}</priority>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // We generate the XML sitemap with the static pages
  // TODO: Add dynamic pages here if applicable by fetching their paths
  // Example: const dynamicPages = await fetchBlogPosts().then(posts => posts.map(p => `/blog/${p.slug}`));
  const allPages = [...staticPages /*, ...dynamicPages */];

  const sitemap = generateSiteMap(allPages);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;

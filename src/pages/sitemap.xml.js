const EXTERNAL_DATA_URL = "https://boosttoad.com"; // Replace with your domain

// List your site's static pages here
const staticPages = [
  "/",
  "/create-project",
  "/learn/lean-canvas",
  "/learn/four-c-framework", // Added 4C framework page
  "/pricing",
  // Add other static pages like /faq, /terms, /privacy if they exist
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
           <lastmod>${
             new Date().toISOString().split("T")[0]
           }</lastmod> {/* Use current date or fetch last modified date */}
           <changefreq>weekly</changefreq> {/* Adjust frequency */}
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
  // TODO: Add dynamic pages (e.g., blog posts) here if applicable by fetching their paths
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

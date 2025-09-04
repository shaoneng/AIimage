const siteUrl =
  process.env.NEXT_PUBLIC_DOMAIN ||
  process.env.SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_BRANCH_URL ||
  "http://localhost:3000";

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ["/api/*"],
};

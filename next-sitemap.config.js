// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: process.env.SITE_URL || 'https://www.frantisekpeterka.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
}
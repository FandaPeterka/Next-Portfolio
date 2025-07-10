/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.frantisekpeterka.com',
  generateRobotsTxt: true,  // kromě sitemap.xml se vygeneruje i robots.txt
  sitemapSize: 7000,
}
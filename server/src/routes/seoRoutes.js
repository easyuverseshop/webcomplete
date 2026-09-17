const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

const DOMAIN = 'https://easyuverse.shop';

// @desc    Generate Google Search Console Sitemap.xml
// @route   GET /sitemap.xml
// @access  Public
router.get('/sitemap.xml', async (req, res) => {
  try {
    const projects = await Project.find({ isPublished: true }).select('slug updatedAt');

    const projectUrls = projects
      .map(
        (p) => `
    <url>
      <loc>${DOMAIN}/projects/${p.slug}</loc>
      <lastmod>${new Date(p.updatedAt).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
      )
      .join('');

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${DOMAIN}/projects</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${DOMAIN}/support</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>${projectUrls}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemapXml);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
});

// @desc    Generate Robots.txt
// @route   GET /robots.txt
// @access  Public
router.get('/robots.txt', (req, res) => {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /checkout/status

Sitemap: ${DOMAIN}/sitemap.xml`;

  res.header('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

module.exports = router;

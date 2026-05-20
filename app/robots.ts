import type { MetadataRoute } from 'next';

const siteUrl = 'https://gromosome.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/connect/submission-success']
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl
  };
}

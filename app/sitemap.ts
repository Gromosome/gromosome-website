import type { MetadataRoute } from 'next';

const siteUrl = 'https://gromosome.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/vision', '/connect'];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8
  }));
}

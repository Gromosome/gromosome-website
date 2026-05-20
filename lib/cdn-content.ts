const CDN_BASE_URL = 'https://www.cdn.gromosome.com/main/data';

export const contentUrls = {
  about: `${CDN_BASE_URL}/about-content.json`,
  appointment: `${CDN_BASE_URL}/appointment-content.json`,
  home: `${CDN_BASE_URL}/home-content.json`
} as const;

export type RemotePageContent = {
  page: {
    title: string;
    description: string;
  };
  sections: Array<{ component: string } & Record<string, unknown>>;
};

export async function getRemoteContent<T extends RemotePageContent>(url: string): Promise<T> {
  const response = await fetch(url, {
    next: {
      revalidate: 3600
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to load content from ${url}: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

import { contentUrls, getRemoteContent, type RemotePageContent } from '@/lib/cdn-content';
import type { Product, ProductGridSection } from '@/lib/types';

type PageContent = {
  sections: Array<{ component: string }>;
};

export async function getAllProducts(): Promise<Product[]> {
  const home = await getRemoteContent<RemotePageContent>(contentUrls.home);

  return (home as unknown as PageContent).sections
    .filter((section) => section.component === 'productGrid')
    .flatMap((section) => (section as unknown as ProductGridSection).items);
}

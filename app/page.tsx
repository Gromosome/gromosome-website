import type { Metadata } from 'next';
import { RenderSections, type PageSection } from '@/components/PageSections';
import { contentUrls, getRemoteContent, type RemotePageContent } from '@/lib/cdn-content';

const pageDescription = 'AI-first software architecture, infrastructure products, domain ERPs, and scalable MVP delivery for modern teams.';

export const metadata: Metadata = {
  title: 'Gromosome | AI-First Software Architecture, ERP Platforms, and MVP Development',
  description: pageDescription,
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Gromosome | AI-First Software Architecture and Scalable Product Delivery',
    description: pageDescription,
    url: '/'
  },
  twitter: {
    title: 'Gromosome | AI-First Software Architecture and Scalable Product Delivery',
    description: pageDescription
  }
};

export default async function HomePage() {
  const home = await getRemoteContent<RemotePageContent>(contentUrls.home);

  return (
    <main>
      <RenderSections sections={home.sections as PageSection[]} />
    </main>
  );
}

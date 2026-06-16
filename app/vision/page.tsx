import type { Metadata } from 'next';
import { RenderSections, type PageSection } from '@/components/PageSections';
import { contentUrls, getRemoteContent, type RemotePageContent } from '@/lib/cdn-content';

const pageTitle = 'About Gromosome';
const founderName = 'Pressnave Kiruparaj';
const pageDescription = `Gromosome, founded by ${founderName}, is an AI-first software company building architectural products, domain-ready platforms, and scalable MVPs.`;

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  authors: [{ name: founderName }],
  creator: founderName,
  keywords: [
    'Gromosome',
    founderName,
    'Pressnave',
    'Kiruparaj',
    'AI-first software company',
    'software architecture',
    'domain-ready platforms',
    'scalable MVPs'
  ],
  alternates: {
    canonical: '/vision'
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: '/vision'
  },
  twitter: {
    title: pageTitle,
    description: pageDescription
  }
};

export default async function AboutPage() {
  const about = await getRemoteContent<RemotePageContent>(contentUrls.about);

  return (
    <main className="gromo-grid px-5 py-16 lg:px-8">
      <RenderSections sections={about.sections as PageSection[]} />
    </main>
  );
}

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const pageDescription = 'Request a secure appointment with Gromosome using a verified email.';

export const metadata: Metadata = {
  title: 'Connect',
  description: pageDescription,
  alternates: {
    canonical: '/connect'
  },
  openGraph: {
    title: 'Connect with Gromosome',
    description: pageDescription,
    url: '/connect'
  },
  twitter: {
    title: 'Connect with Gromosome',
    description: pageDescription
  }
};

export default function ConnectLayout({ children }: { children: ReactNode }) {
  return children;
}

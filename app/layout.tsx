import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AnimatedBackground } from '@/components/AnimatedBackground';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = 'https://gromosome.com';
const siteName = 'Gromosome';
const siteDescription =
  'Gromosome builds AI-first software architecture, infrastructure products, domain-ready ERP platforms, and scalable MVPs for modern businesses.';
const logoUrl = 'https://www.cdn.gromosome.com/main/img/logos/gromosome.png';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  keywords: [
    'Gromosome',
    'software architecture',
    'AI software company',
    'ERP platforms',
    'MVP development',
    'API-first development',
    'microservice architecture',
    'cloud software development',
    'domain-driven design'
  ],
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: logoUrl,
        width: 512,
        height: 512,
        alt: `${siteName} logo`
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
    images: [logoUrl]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  },
  icons: {
    icon: logoUrl,
    shortcut: logoUrl,
    apple: logoUrl
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AnimatedBackground />
          <div className="relative z-10 min-h-screen">
            <Header />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

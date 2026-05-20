'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const nav = [
  { label: 'Platform', href: '/' },
  { label: 'Vision', href: '/vision' },
  { label: 'Connect', href: '/connect' }
];

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-orange-500/10 bg-orange-50/75 backdrop-blur-xl dark:bg-black/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="https://www.cdn.gromosome.com/main/img/logos/gromosome.png" alt="Gromosome" width={40} height={40} className="rounded-xl" />
          <div>
            <div className="text-3xl font-semibold tracking-[0.1em] text-gromo-600 dark:text-gromo-300 font-space">
              Gromosome
            </div>
          </div>
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-orange-100 hover:text-gromo-700 dark:text-zinc-300 dark:hover:bg-orange-500/10 dark:hover:text-orange-200">
              {item.label}
            </Link>
          ))}
        </nav>
        <button onClick={toggleTheme} className="rounded-full border border-orange-500/20 p-2 text-gromo-700 transition hover:bg-orange-100 dark:text-orange-200 dark:hover:bg-orange-500/10" aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}

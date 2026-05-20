import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-orange-500/10 px-5 py-10 dark:bg-black/40 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 text-center text-sm text-zinc-600 dark:text-zinc-400 md:flex-row">
            <p>Gromosome © {new Date().getFullYear()} |  Built to evolve and scale</p>
        </div>
    </footer>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const successMessage = '<Request_Submitted/>';

export const metadata: Metadata = {
  title: 'Appointment Request Submitted',
  description: 'Your Gromosome appointment request has been received.',
  robots: {
    index: false,
    follow: false
  }
};

export default function SubmissionSuccessPage() {
  return (
    <main className="gromo-grid flex min-h-screen items-center justify-center px-5 py-16 lg:px-8">
      <section className="w-full max-w-7xl text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300">
          <svg viewBox="0 0 64 64" className="h-11 w-11" aria-hidden="true">
            <path
              d="M18 33.5 27.5 43 47 21"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="6"
            />
          </svg>
        </div>

        <h1 className="mx-auto flex min-h-32 w-full items-center justify-center text-zinc-950 dark:text-zinc-50" aria-label={successMessage}>
          <span className="submission-typing">{successMessage}</span>
        </h1>

        <p className="mx-auto mt-2 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Your appointment request has been received.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-zinc-800 dark:bg-orange-500 dark:text-black dark:hover:bg-orange-400"
        >
          <ArrowLeft size={18} />
          Back to home
        </Link>
      </section>
    </main>
  );
}

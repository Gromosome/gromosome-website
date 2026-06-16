import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Cpu, Network, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import { ProductGrid } from '@/components/ProductGrid';
import type { Cta, ProductGridSection } from '@/lib/types';

type HeroSection = {
  component: 'hero';
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryAction: Cta;
  secondaryAction: Cta;
  image: {
    src: string;
    alt: string;
  };
  statusLines: string[];
};

type OverviewSection = {
  component: 'overview';
  eyebrow: string;
  title: string;
  content: string;
};

type CapabilityListSection = {
  component: 'capabilityList';
  eyebrow: string;
  title: string;
  items: string[];
};

type PageIntroSection = {
  component: 'pageIntro';
  eyebrow: string;
  title: string;
  intro: string;
};

type PrincipleGridSection = {
  component: 'principleGrid';
  items: Array<{
    icon: keyof typeof iconMap;
    title: string;
    description: string;
  }>;
};

type FounderProfileSection = {
  component: 'founderProfile';
  eyebrow: string;
  name: string;
  role: string;
  avatar: {
    lightSrc?: string;
    darkSrc?: string;
    fallback: string;
    alt: string;
  };
  linkedin?: {
    href: string;
    logoSrc: string;
    label: string;
  };
  bio: string;
};

export type PageSection =
  | HeroSection
  | OverviewSection
  | ProductGridSection
  | CapabilityListSection
  | PageIntroSection
  | PrincipleGridSection
  | FounderProfileSection;

const iconMap = {
  Workflow,
  Network,
  ShieldCheck,
  Sparkles,
  Cpu
};

export function RenderSections({ sections }: { sections: PageSection[] }) {
  return (
    <>
      {sections.map((section, index) => (
        <RenderSection key={`${section.component}-${index}`} section={section} />
      ))}
    </>
  );
}

function RenderSection({ section }: { section: PageSection }) {
  switch (section.component) {
    case 'hero':
      return <HeroSection section={section} />;
    case 'overview':
      return <OverviewSection section={section} />;
    case 'productGrid': {
      return <ProductGrid title={section.title} subtitle={section.subtitle} products={section.items} />;
    }
    case 'capabilityList':
      return <CapabilityListSection section={section} />;
    case 'pageIntro':
      return <PageIntroSection section={section} />;
    case 'principleGrid':
      return <PrincipleGridSection section={section} />;
    case 'founderProfile':
      return <FounderProfileSection section={section} />;
    default:
      return null;
  }
}

function HeroSection({ section }: { section: HeroSection }) {
  return (
    <section className="gromo-grid relative overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-orange-100/80 via-transparent to-orange-50 dark:from-orange-500/10 dark:to-black" />
      <div className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-orange-500/20 bg-white/70 px-4 py-2 text-sm font-bold text-gromo-700 dark:bg-black/40 dark:text-orange-200">
            {section.eyebrow}
          </p>
          <h1 className="text-balance text-5xl font-black tracking-tight md:text-7xl">{section.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">{section.subtitle}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href={section.primaryAction.href} className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 py-4 font-bold text-white transition hover:bg-gromo-600 dark:bg-orange-500 dark:text-black dark:hover:bg-orange-300">
              {section.primaryAction.label} <ArrowRight size={18} />
            </Link>
            <Link href={section.secondaryAction.href} className="inline-flex items-center justify-center rounded-full border border-orange-500/25 px-6 py-4 font-bold text-zinc-800 transition hover:bg-orange-100 dark:text-zinc-100 dark:hover:bg-orange-500/10">
              {section.secondaryAction.label}
            </Link>
          </div>
        </div>
        <div className="relative mx-auto hidden w-full max-w-md lg:block">
          <div className="absolute inset-0 rounded-full bg-orange-500/25 blur-3xl" />
          <div className="card-surface relative rounded-[2rem] p-10 shadow-glow">
            <Image src={section.image.src} alt={section.image.alt} width={520} height={520} priority className="mx-auto" />
            <div className="mt-6 rounded-3xl bg-zinc-950 p-5 text-sm text-orange-100 dark:bg-black">
              {section.statusLines.map((line, index) => (
                <p key={line} className={`${index > 0 ? 'mt-2 text-orange-300' : ''} font-mono`}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OverviewSection({ section }: { section: OverviewSection }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gromo-600 dark:text-gromo-300">{section.eyebrow}</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">{section.title}</h2>
        </div>
        <div className="card-surface rounded-3xl p-7 text-lg leading-8 text-zinc-700 dark:text-zinc-300">{section.content}</div>
      </div>
    </section>
  );
}

function CapabilityListSection({ section }: { section: CapabilityListSection }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <div className="rounded-[2rem] bg-zinc-950 p-8 text-white shadow-glow dark:bg-orange-500 dark:text-black lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] opacity-70">{section.eyebrow}</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">{section.title}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {section.items.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0" />
                <p className="font-semibold leading-7">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PageIntroSection({ section }: { section: PageIntroSection }) {
  return (
    <section className="mx-auto max-w-7xl">
      <div className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gromo-600 dark:text-gromo-300">{section.eyebrow}</p>
        <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">{section.title}</h1>
        <p className="mt-6 text-xl leading-9 text-zinc-700 dark:text-zinc-300">{section.intro}</p>
      </div>
    </section>
  );
}

function PrincipleGridSection({ section }: { section: PrincipleGridSection }) {
  return (
    <section className="mx-auto mt-14 grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
      {section.items.map((item) => {
        const Icon = iconMap[item.icon] ?? Workflow;

        return (
          <article key={item.title} className="card-surface rounded-3xl p-7">
            <div className="mb-5 inline-flex rounded-2xl bg-orange-500/10 p-3 text-gromo-700 dark:text-orange-200">
              <Icon size={24} />
            </div>
            <h2 className="text-2xl font-black tracking-tight">{item.title}</h2>
            <p className="mt-4 leading-8 text-zinc-700 dark:text-zinc-300">{item.description}</p>
          </article>
        );
      })}
    </section>
  );
}

function FounderProfileSection({ section }: { section: FounderProfileSection }) {
  return (
    <section id="founder" className="mx-auto mt-16 max-w-7xl scroll-mt-24">
      <div className="card-surface overflow-hidden rounded-[2rem]">
        <div className="grid gap-0 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex items-center justify-center p-6 sm:p-10">
            <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-[1.5rem] border border-orange-500/60">
              <Image
                src={section.avatar.lightSrc || section.avatar.fallback}
                alt={section.avatar.alt}
                fill
                sizes="(min-width: 1024px) 360px, calc(100vw - 5rem)"
                className="object-contain dark:hidden"
              />
              <Image
                src={section.avatar.darkSrc || section.avatar.fallback}
                alt={section.avatar.alt}
                fill
                sizes="(min-width: 1024px) 360px, calc(100vw - 5rem)"
                className="hidden object-contain dark:block"
              />
            </div>
          </div>
          <div className="p-8 lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gromo-600 dark:text-gromo-300">{section.eyebrow}</p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <h2 className="text-4xl font-black tracking-tight">{section.name}</h2>
              {section.linkedin ? (
                <a
                  href={section.linkedin.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={section.linkedin.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full  transition hover:bg-orange-500/20"
                >
                  <Image src={section.linkedin.logoSrc} alt="" width={42} height={42} unoptimized />
                </a>
              ) : null}
            </div>
            <p className="mt-2 text-lg font-semibold text-gromo-700 dark:text-orange-200">{section.role}</p>
            <p className="mt-6 text-lg leading-9 text-zinc-700 dark:text-zinc-300">{section.bio}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

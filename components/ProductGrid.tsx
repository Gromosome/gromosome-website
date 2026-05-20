'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock3 } from 'lucide-react';
import { useRef, useState } from 'react';
import type { Product } from '@/lib/types';
import './components.css';

export function ProductGrid({
                                title,
                                subtitle,
                                products
                            }: {
    title: string;
    subtitle: string;
    products: Product[];
}) {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const updateScrollState = () => {
        const el = scrollRef.current;
        if (!el) return;

        setCanScrollLeft(el.scrollLeft > 5);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
    };

    const scrollProducts = (direction: 'left' | 'right') => {
        const el = scrollRef.current;
        if (!el) return;

        const cardWidth = el.clientWidth < 768 ? el.clientWidth : el.clientWidth / 3;
        el.scrollBy({
            left: direction === 'right' ? cardWidth : -cardWidth,
            behavior: 'smooth'
        });

        setTimeout(updateScrollState, 350);
    };

    return (
        <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
            <div className="mb-7 flex items-end justify-between gap-5">
                <div className="max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gromo-600 dark:text-gromo-300">
                        {subtitle}
                    </p>

                    <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                        {title}
                    </h2>
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    <button
                        type="button"
                        onClick={() => scrollProducts('left')}
                        disabled={!canScrollLeft}
                        className="relative z-20 flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-lg transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                        aria-label="Scroll products left"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <button
                        type="button"
                        onClick={() => scrollProducts('right')}
                        disabled={!canScrollRight}
                        className="relative z-20 flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-lg transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                        aria-label="Scroll products right"
                    >
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            <div className="relative">
                {/* Mobile left button */}
                <button
                    type="button"
                    onClick={() => scrollProducts('left')}
                    disabled={!canScrollLeft}
                    className="absolute left-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white/95 shadow-xl backdrop-blur transition disabled:cursor-not-allowed disabled:opacity-40 md:hidden dark:border-zinc-800 dark:bg-zinc-950/95"
                    aria-label="Scroll products left"
                >
                    <ArrowLeft size={17} />
                </button>

                {/* Mobile right button */}
                <button
                    type="button"
                    onClick={() => scrollProducts('right')}
                    disabled={!canScrollRight}
                    className="absolute right-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-950 text-white shadow-xl backdrop-blur transition disabled:cursor-not-allowed disabled:opacity-40 md:hidden dark:border-zinc-800 dark:bg-zinc-950/95"
                    aria-label="Scroll products right"
                >
                    <ArrowRight size={17} />
                </button>

                <div
                    ref={scrollRef}
                    onScroll={updateScrollState}
                    className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4"
                >
                    {products.map((product, index) => (
                        <motion.article
                            key={product.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: index * 0.04 }}
                            className="card-surface relative min-h-[340px] w-full flex-none snap-start overflow-hidden rounded-3xl p-7 sm:w-[calc(100%-8px)] md:w-[calc((100%-40px)/3)]"
                        >
                            <div className="absolute right-[-60px] top-[-60px] h-44 w-44 rounded-full bg-orange-500/10 blur-3xl" />

                            <div className="relative flex h-full flex-col">
                                <div className="mb-5 flex items-start justify-between gap-4">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <Image
                                            src={product.logo}
                                            alt={`${product.name} logo`}
                                            width={46}
                                            height={46}
                                            className="rounded-2xl"
                                        />

                                        <h3 className="truncate text-xl font-black tracking-tight lg:text-2xl">
                                            {product.name}
                                        </h3>
                                    </div>


                                </div>

                                <ExpandableText text={product.description} />

                                <div className="mt-auto pt-6">
                                    {product.isAvailable ? (
                                        <Link
                                            href={product.link}
                                            className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-gromo-600 dark:bg-orange-500 dark:text-black dark:hover:bg-orange-300"
                                        >
                                            View product <ArrowRight size={16} />
                                        </Link>
                                    ) : (
                                        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 px-5 py-3 text-sm font-bold text-zinc-600 dark:text-zinc-300">
                                            <Clock3 size={16} /> Coming soon
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ExpandableText({ text }: { text: string }) {
    return (
        <div className="group relative">
            <p className="max-h-24 overflow-hidden rounded-2xl bg-orange-50/80 p-4 text-sm leading-7 text-zinc-700 transition-all duration-300 group-hover:max-h-48 group-hover:overflow-y-auto dark:bg-zinc-900/70 dark:text-zinc-300">
                {text}
            </p>

            <div className="pointer-events-none absolute bottom-7 left-0 right-0 h-10 rounded-b-2xl bg-gradient-to-t from-orange-50 to-transparent group-hover:hidden dark:from-zinc-900" />

            <span className="mt-2 inline-block text-xs font-semibold text-gromo-700 dark:text-orange-300">
        Hover to expand
      </span>
        </div>
    );
}

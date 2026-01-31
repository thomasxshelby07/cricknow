"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface FeaturedItem {
    _id: string;
    title: string;
    slug: string;
    coverImageUrl?: string;
    category?: string;
    createdAt: string | Date;
    summary?: string;
    excerpt?: string;
}

interface FeaturedSliderProps {
    items: FeaturedItem[];
    basePath: string; // '/blogs' or '/news'
}

export function FeaturedSlider({ items, basePath }: FeaturedSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auto-play (optional, user can disable by interaction)
    useEffect(() => {
        const interval = setInterval(() => {
            scrollToIndex((currentIndex + 1) % items.length);
        }, 5000); // 5 seconds
        return () => clearInterval(interval);
    }, [currentIndex, items.length]);

    const scrollToIndex = (index: number) => {
        setCurrentIndex(index);
        if (scrollContainerRef.current) {
            const width = scrollContainerRef.current.offsetWidth;
            scrollContainerRef.current.scrollTo({
                left: width * index,
                behavior: "smooth",
            });
        }
    };

    if (!items || items.length === 0) return null;

    return (
        <div className="relative group w-full overflow-hidden rounded-xl bg-neutral-900 shadow-lg">
            {/* Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="flex w-full overflow-x-hidden snap-x snap-mandatory scroll-smooth bg-black"
                style={{ scrollbarWidth: 'none' }}
            >
                {items.map((item, index) => (
                    <div
                        key={item._id}
                        className="min-w-full relative h-[280px] md:h-[380px] snap-center"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            {item.coverImageUrl ? (
                                <img
                                    src={item.coverImageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover opacity-85"
                                />
                            ) : (
                                <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-600">
                                    No Image
                                </div>
                            )}
                            {/* Gradients */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-end items-start z-10">
                            {item.category && (
                                <span className="inline-block px-2 py-0.5 bg-white/95 text-black text-[10px] md:text-xs font-bold rounded mb-2 uppercase tracking-wider backdrop-blur-md shadow-sm">
                                    {item.category}
                                </span>
                            )}

                            <h2 className="text-lg md:text-3xl font-black text-white mb-2 leading-tight max-w-3xl drop-shadow-md">
                                {item.title}
                            </h2>

                            <p className="hidden md:block text-gray-300 text-sm max-w-lg mb-4 line-clamp-2 leading-relaxed font-medium">
                                {item.summary || item.excerpt}
                            </p>

                            <div className="flex items-center gap-4 mt-1 md:mt-0">
                                <Link
                                    href={`${basePath}/${item.slug}`}
                                    className="inline-flex items-center gap-1.5 bg-white text-black px-4 py-1.5 md:px-5 md:py-2 rounded-lg text-xs md:text-sm font-bold hover:bg-gray-200 transition-all shadow-md"
                                >
                                    {basePath.includes('news') ? 'Read News' : 'Read Article'} <ArrowRight className="w-3.5 h-3.5" />
                                </Link>

                                {/* Mobile Date */}
                                <div className="flex md:hidden items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                                    <Calendar className="w-3 h-3" />
                                    {format(new Date(item.createdAt), 'MMM d, yyyy')}
                                </div>
                            </div>
                        </div>

                        {/* Top Right Date (Desktop) */}
                        <div className="absolute top-4 right-4 hidden md:flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 shadow-sm">
                            <Calendar className="w-3 h-3 text-white/80" />
                            <span className="text-white/90 text-xs font-semibold tracking-wide">
                                {format(new Date(item.createdAt), 'MMM d, yyyy')}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Buttons - Hidden on Mobile to reduce clutter */}
            {items.length > 1 && (
                <>
                    <button
                        onClick={() => scrollToIndex((currentIndex - 1 + items.length) % items.length)}
                        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/10 text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 scale-90"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scrollToIndex((currentIndex + 1) % items.length)}
                        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/10 text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 scale-90"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-3 right-3 md:right-auto md:left-1/2 md:-translate-x-1/2 flex items-center gap-1.5 z-20">
                        {items.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => scrollToIndex(idx)}
                                className={`h-1 transition-all rounded-full drop-shadow-sm ${idx === currentIndex
                                    ? "w-4 md:w-6 bg-white"
                                    : "w-1.5 bg-white/40 hover:bg-white/80"
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

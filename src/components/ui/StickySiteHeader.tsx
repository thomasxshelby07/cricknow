"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface StickySiteHeaderProps {
    siteName: string;
    affiliateLink: string;
}

export function StickySiteHeader({ siteName, affiliateLink }: StickySiteHeaderProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show header after scrolling past the main hero (approx 300px)
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className={cn(
                "fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 transition-all duration-300 transform",
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
            )}
        >
            <div className="container mx-auto px-4 h-14 flex items-center justify-between">

                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 overflow-hidden">
                    <Link href="/" className="hover:text-black dark:hover:text-white transition-colors flex-shrink-0">Home</Link>
                    <ChevronRight className="w-3 h-3 flex-shrink-0" />
                    <Link href="/betting-sites" className="hover:text-black dark:hover:text-white transition-colors flex-shrink-0">Betting Sites</Link>
                    <ChevronRight className="w-3 h-3 flex-shrink-0" />
                    <span className="text-black dark:text-white truncate max-w-[150px] md:max-w-xs">{siteName}</span>
                </div>

                {/* Mini CTA for Mobile/Desktop */}
                <a href={affiliateLink} target="_blank" rel="nofollow noreferrer">
                    <Button size="sm" className="h-8 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold text-[10px] uppercase tracking-wider px-4">
                        Claim Bonus
                    </Button>
                </a>
            </div>
        </div>
    );
}

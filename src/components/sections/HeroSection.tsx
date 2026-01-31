"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Zap, Trophy, Star, Users } from "lucide-react";

interface HeroSectionProps {
    title?: string;
    subtitle?: string;
    bgImage?: string;
    ctaText?: string;
    ctaLink?: string;
}

export function HeroSection({
    title = "Best Online Betting Sites in India",
    subtitle = "Compare the top rated bookmakers, get exclusive bonuses, and start winning today.",
    bgImage,
    ctaText = "Find Your Site",
    ctaLink = "/betting-sites"
}: HeroSectionProps) {
    const sellingPoints = [
        { icon: Star, text: "Best Review Site" },
        { icon: Zap, text: "Top Offers Available" },
        { icon: ShieldCheck, text: "100% Safe & Secure" },
        { icon: Trophy, text: "Expert Predictions" },
        { icon: Users, text: "Instant Withdrawals" },
    ];

    return (
        <section className="relative w-full flex flex-col pt-28 md:pt-32 pb-0 overflow-hidden bg-white text-neutral-900 border-b border-gray-100">
            {/* Animations Styles */}
            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>

            {/* Background Pattern - Very Subtle Dot Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70"></div>

            {bgImage && (
                <div className="absolute inset-0 bg-cover bg-center opacity-[0.03] grayscale" style={{ backgroundImage: `url(${bgImage})` }}></div>
            )}

            <div className="container relative z-10 mx-auto px-4 md:px-6 text-center flex-grow mb-20">
                {/* Badge/Pill - Black Outline */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-8 animate-fade-in-up">
                    <div className="h-1.5 w-1.5 rounded-full bg-black animate-pulse"></div>
                    <span className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-wider">#1 Trusted Betting Reviews</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-neutral-900 mb-8 leading-tight max-w-6xl mx-auto">
                    {title}
                </h1>

                <p className="text-lg md:text-2xl text-gray-500 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
                    {subtitle}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-fade-in-up delay-100">
                    <Link href={ctaLink}>
                        <Button size="lg" className="bg-black hover:bg-neutral-800 text-white px-10 py-7 text-lg rounded-full shadow-xl shadow-black/10 transition-all transform hover:scale-105 font-bold border-none ring-offset-2 focus:ring-2 ring-black">
                            {ctaText}
                        </Button>
                    </Link>
                    <Link href="/cricket-apps">
                        <Button size="lg" variant="outline" className="border-gray-200 bg-white text-black hover:bg-gray-50 hover:border-gray-300 px-10 py-7 text-lg rounded-full transition-all font-semibold">
                            Explore Apps
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Scrolling Marquee Strip */}
            <div className="relative w-full bg-neutral-900 py-4 border-t border-neutral-800 overflow-hidden z-20">
                <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
                    {/* First Loop */}
                    <div className="flex gap-16 px-8">
                        {sellingPoints.map((point, i) => (
                            <div key={`a-${i}`} className="flex items-center gap-3 text-white/90">
                                <point.icon className="w-5 h-5 text-gray-400" />
                                <span className="text-sm md:text-base font-bold uppercase tracking-widest whitespace-nowrap">{point.text}</span>
                            </div>
                        ))}
                    </div>
                    {/* Second Loop (Duplicate for seamless scroll) */}
                    <div className="flex gap-16 px-8">
                        {sellingPoints.map((point, i) => (
                            <div key={`b-${i}`} className="flex items-center gap-3 text-white/90">
                                <point.icon className="w-5 h-5 text-gray-400" />
                                <span className="text-sm md:text-base font-bold uppercase tracking-widest whitespace-nowrap">{point.text}</span>
                            </div>
                        ))}
                    </div>
                    {/* Third Loop (Extra safety for large screens) */}
                    <div className="flex gap-16 px-8">
                        {sellingPoints.map((point, i) => (
                            <div key={`c-${i}`} className="flex items-center gap-3 text-white/90">
                                <point.icon className="w-5 h-5 text-gray-400" />
                                <span className="text-sm md:text-base font-bold uppercase tracking-widest whitespace-nowrap">{point.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

import { Metadata } from "next";
import connectToDatabase from "@/lib/db";
import { HomePageConfig } from "@/models/HomePageConfig";

// Components
import { HeroSection } from "@/components/sections/HeroSection";
import { BettingSiteList } from "@/components/sections/BettingSiteList";
import { BlogGrid } from "@/components/sections/BlogGrid";
import { NewsGrid } from "@/components/public/NewsGrid";
import { FAQSection } from "@/components/sections/FAQSection";
import { AboutPlatform, WhyChooseUs, ResponsibleGaming } from "@/components/sections/StaticHomeSections";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Cricknow - Best Online Cricket Betting Sites & News",
    description: "Your ultimate guide to online cricket betting. Find top-rated bookmarkers, exclusive bonuses, latest cricket news, and expert betting tips.",
};

// --- DATA FETCHING ---
async function getHomeConfig() {
    await connectToDatabase();

    // Find config or return default structure if completely missing (ignoring auto-create for read-only safety here)
    const config = await HomePageConfig.findOne({ isDefault: true }).lean();

    if (!config) {
        return {
            bettingSites: { isVisible: true, selectedIds: [] },
            blogs: { isVisible: true, selectedIds: [] },
            news: { isVisible: true, selectedIds: [] }
        };
    }
    return config;
}

export const revalidate = 60; // Revalidate every minute (or use on-demand revalidation in admin actions)

export default async function HomePage() {
    const config = await getHomeConfig();

    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">

            {/* 1. HERO SECTION (Fixed - H1) */}
            <HeroSection
                title="Bet Smarter on Cricket"
                subtitle="Compare top-rated betting sites, grab exclusive bonuses, and get expert predictions for every match."
                ctaText="Find Best Site"
                ctaLink="#betting-sites"
            />

            {/* 2. BETTING SITES SECTION (Admin Controlled) */}
            {config.bettingSites.isVisible && (
                <div id="betting-sites">
                    <div className="container mx-auto px-4 pt-16 pb-4">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-neutral-dark dark:text-white">
                                Top Rated Betting Sites
                            </h2>
                            <p className="text-gray-500 mt-2">Curated list of the most trusted platforms for Indian players.</p>
                        </div>
                    </div>
                    <BettingSiteList
                        count={10}
                        filter="featured"
                        manualIds={config.bettingSites.selectedIds?.map((id: any) => id.toString())}
                    />

                    {/* View All Link */}
                    <div className="container mx-auto px-4 py-8 text-center border-b border-gray-200 dark:border-gray-800">
                        <Link href="/betting-sites">
                            <Button variant="ghost" className="text-lg font-bold text-neutral-900 dark:text-white hover:bg-transparent hover:underline group">
                                View All Betting Sites
                                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>
                </div>
            )}



            {/* 3. BLOGS SECTION (Admin Controlled) */}
            {config.blogs.isVisible && (
                <BlogGrid
                    count={3}
                    title="Expert Guides & Tips"
                    showLink={true}
                    manualIds={config.blogs.selectedIds?.map((id: any) => id.toString())}
                    showOnHomeOnly={true}
                />
            )}

            {/* 4. NEWS SECTION (Admin Controlled) */}
            {config.news.isVisible && (
                <NewsGrid
                    count={3}
                    title="Latest Cricket News"
                    showLink={true}
                    manualIds={config.news.selectedIds?.map((id: any) => id.toString())}
                />
            )}

            {/* 5. ABOUT PLATFORM (Static) */}
            <AboutPlatform />

            {/* 6. WHY CHOOSE US (Static) */}
            <WhyChooseUs />

            {/* 7. TESTIMONIALS (Static) */}
            <TestimonialsSection />

            {/* 8. FAQ SECTION (Static - Defaults Used) */}
            <FAQSection />

            {/* 9. RESPONSIBLE GAMING (Static) */}
            <ResponsibleGaming />

            {/* 10. Footer (Handled by Layout) */}
        </div>
    );
}

import { BlogGrid } from "@/components/sections/BlogGrid";
import { Metadata } from "next";
import { Blog } from "@/models/Blog"; // Direct DB Access
import { News } from "@/models/News";
import { BettingSite } from "@/models/BettingSite";
import connectToDatabase from "@/lib/db";
import { FeaturedSlider } from "@/components/public/FeaturedSlider";
import Link from 'next/link';
import { Trophy, Star, ArrowRight, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export const metadata: Metadata = {
    title: "Expert Cricket Blogs & Betting Guides | Cricknow",
    description: "Read expert strategies, betting guides, and in-depth articles about cricket.",
};

async function getFeaturedBlogs() {
    await connectToDatabase();
    return await Blog.find({
        'visibility.status': 'published',
        isFeatured: true
    })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();
}

async function getSidebarData() {
    await connectToDatabase();

    // Fetch Trending/Recent News (Limit 3)
    const trendingNews = await News.find({ 'visibility.status': 'published' })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean();

    // Fetch Sidebar Sites
    const sidebarSites = await BettingSite.find({
        'visibility.status': 'published',
        showOnBlogSidebar: true
    })
        .select('name slug logoUrl rating ctaText')
        .sort({ 'visibility.displayOrder': 1 })
        .limit(5)
        .lean();

    return { trendingNews, sidebarSites };
}

export default async function BlogsPage() {
    const featuredBlogs = await getFeaturedBlogs();
    const { trendingNews, sidebarSites } = await getSidebarData();
    const featuredIds = featuredBlogs.map((b: any) => b._id.toString());

    return (
        <div className="bg-white dark:bg-black min-h-screen">
            {/* Header Section (Black & White Theme) */}
            <div className="bg-black text-white py-8 md:py-12 px-4 border-b border-gray-800">
                <div className="container mx-auto max-w-4xl text-center space-y-2">
                    <h1 className="text-2xl md:text-4xl font-black tracking-tight uppercase">
                        Blogs & Guides
                    </h1>
                    <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto">
                        In-depth analysis, expert betting strategies, and tactical breakdowns.
                    </p>
                </div>
            </div>

            {/* Featured Slider Section */}
            {featuredBlogs.length > 0 && (
                <div className="container mx-auto px-4 mt-8 mb-12">
                    <FeaturedSlider items={JSON.parse(JSON.stringify(featuredBlogs))} basePath="/blogs" />
                </div>
            )}

            <div className="container mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Main Blog Grid */}
                    <div className="lg:col-span-8">
                        <div className={featuredBlogs.length > 0 ? "" : "mt-8"}>
                            <BlogGrid
                                count={50}
                                title={featuredBlogs.length > 0 ? "More Articles" : "Latest Articles"}
                                showLink={false}
                                showEmptyState={true}
                                excludeIds={featuredIds}
                            />
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <aside className="lg:col-span-4 space-y-8 mt-12 lg:mt-0">

                        {/* 1. Trending News Widget */}
                        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                            <h3 className="text-lg font-black uppercase text-neutral-900 dark:text-white mb-5 flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                                <TrendingUp className="w-5 h-5 text-red-500" /> Trending News
                            </h3>
                            <div className="space-y-5">
                                {trendingNews.length > 0 ? trendingNews.map((news: any) => (
                                    <Link key={news._id} href={`/${news.slug}`} className="group flex gap-3 items-start">
                                        <div className="w-20 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0 relative">
                                            {news.coverImageUrl ? (
                                                <img src={news.coverImageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                                                {format(new Date(news.createdAt), 'MMM d')}
                                            </div>
                                            <h4 className="text-sm font-bold text-neutral-900 dark:text-white leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                                                {news.title}
                                            </h4>
                                        </div>
                                    </Link>
                                )) : (
                                    <p className="text-gray-400 text-sm">No recent news.</p>
                                )}
                            </div>
                            <Link
                                href="/news"
                                className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white mt-4 uppercase tracking-wide transition-colors"
                            >
                                View All News <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {/* 2. Betting Sites Widget */}
                        {sidebarSites.length > 0 && (
                            <div className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm sticky top-24">
                                <h3 className="text-lg font-black uppercase text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-yellow-500" /> Top Picks
                                </h3>

                                <div className="space-y-3">
                                    {sidebarSites.map((site: any) => (
                                        <div key={site._id} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-black shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-800">
                                            <div className="w-10 h-10 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0 border border-gray-100">
                                                <img src={site.logoUrl} alt={site.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm text-neutral-900 dark:text-white truncate">{site.name}</h4>
                                                <div className="flex items-center gap-1 text-yellow-500 text-[10px] font-bold">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    {site.rating}/10
                                                </div>
                                            </div>
                                            <a
                                                href={site.slug ? `/${site.slug}` : '#'}
                                                className="px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold rounded-lg hover:opacity-80 transition-opacity whitespace-nowrap"
                                            >
                                                Visit
                                            </a>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href="/offers"
                                    className="block w-full py-3 mt-5 bg-primary text-white text-sm font-bold text-center rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                                >
                                    Get Offers
                                </Link>
                            </div>
                        )}

                    </aside>
                </div>
            </div>
        </div>
    );
}

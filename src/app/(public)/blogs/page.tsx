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

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

    // Fetch Trending/Recent News (Limit 5)
    const trendingNews = await News.find({ 'visibility.status': 'published' })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    // Fetch Sidebar Sites
    const sidebarSites = await BettingSite.find({
        'visibility.status': 'published',
        showOnBlogSidebar: true
    })
        .select('name slug logoUrl rating ctaText mainBonusText joiningBonus')
        .sort({ 'visibility.displayOrder': 1 })
        .limit(5)
        .lean();

    return { trendingNews, sidebarSites };
}

export default async function BlogsPage({ searchParams }: { searchParams: { category?: string } }) {
    const category = searchParams.category || 'all';
    const featuredBlogs = await getFeaturedBlogs();
    const { trendingNews, sidebarSites } = await getSidebarData();
    const featuredIds = featuredBlogs.map((b: any) => b._id.toString());

    // Category Map: Value -> Label
    const categories = [
        { value: 'all', label: 'All' },
        { value: 'guides', label: 'Betting Guides' },
        { value: 'betting', label: 'General Betting' },
        { value: 'casino', label: 'Casino Strategy' },
        { value: 'cricket', label: 'Cricket News' },
    ];

    return (
        <div className="bg-white dark:bg-black min-h-screen font-sans">
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

            {/* Featured Slider Section (Only on All) */}
            {featuredBlogs.length > 0 && category === 'all' && (
                <div className="container mx-auto px-4 mt-8 mb-12">
                    <FeaturedSlider items={JSON.parse(JSON.stringify(featuredBlogs))} basePath="/blogs" />
                </div>
            )}

            <div className="container mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Main Blog Grid */}
                    <div className="lg:col-span-8">

                        {/* 🔹 NEW: Category Filters */}
                        <div className="flex flex-wrap gap-3 mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.value}
                                    href={cat.value === 'all' ? '/blogs' : `/blogs?category=${cat.value}`}
                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all uppercase tracking-wider border ${category === cat.value
                                        ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-md'
                                        : 'bg-transparent text-gray-500 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                                        }`}
                                >
                                    {cat.label}
                                </Link>
                            ))}
                        </div>

                        <div className={featuredBlogs.length > 0 && category === 'all' ? "" : "mt-8"}>
                            <BlogGrid
                                count={50}
                                title={category === 'all' ? (featuredBlogs.length > 0 ? "More Articles" : "Latest Articles") : `${categories.find(c => c.value === category)?.label || category}`}
                                showLink={false}
                                showEmptyState={true}
                                excludeIds={category === 'all' ? featuredIds : []} // Don't exclude featured if filtering by category (user expects to see them)
                                category={category}
                            />
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <aside className="lg:col-span-4 space-y-8 mt-12 lg:mt-0">

                        {/* 1. Trending News Widget */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                            <h3 className="text-sm font-black uppercase text-gray-400 mb-6 tracking-widest">
                                Trending News
                            </h3>
                            <div className="space-y-6">
                                {trendingNews.length > 0 ? trendingNews.map((news: any, index: number) => (
                                    <Link key={news._id} href={`/${news.slug}`} className="group flex gap-4 items-start pb-6 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                                        <div className="text-lg font-black text-gray-200 dark:text-gray-800 leading-none mt-1 min-w-[12px]">
                                            {index + 1}
                                        </div>
                                        {news.coverImageUrl && (
                                            <div className="w-20 h-14 rounded-md bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 relative shadow-sm">
                                                <img src={news.coverImageUrl} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-neutral-900 dark:text-white leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-1.5">
                                                {news.title}
                                            </h4>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                                                {format(new Date(news.createdAt), 'MMM d')}
                                            </div>
                                        </div>
                                    </Link>
                                )) : (
                                    <p className="text-gray-400 text-sm">No recent news.</p>
                                )}
                            </div>
                            <Link
                                href="/news"
                                className="block mt-6 text-center text-xs font-black text-black dark:text-white hover:opacity-70 uppercase tracking-widest transition-opacity"
                            >
                                View All News
                            </Link>
                        </div>

                        {/* 2. Betting Sites Widget - Native Look */}
                        {sidebarSites.length > 0 && (
                            <div className="pt-8 border-t border-gray-100 dark:border-gray-800 mt-8">
                                <h3 className="text-sm font-black uppercase text-gray-400 mb-6 tracking-widest">
                                    Exclusive Offers
                                </h3>

                                <div className="space-y-6">
                                    {sidebarSites.map((site: any) => (
                                        <div key={site._id} className="group relative flex flex-col gap-3 pb-6 border-b border-gray-100 dark:border-gray-800 last:border-0 pl-1">
                                            <div className="flex items-center gap-4">
                                                <div className="w-20 h-20 rounded-lg bg-gray-50 dark:bg-gray-800 p-2 flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-700">
                                                    <img src={site.logoUrl} alt={site.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-black text-lg text-neutral-900 dark:text-white leading-none mb-1.5">{site.name}</h4>
                                                    {(site.mainBonusText || site.joiningBonus) && (
                                                        <div className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-black uppercase tracking-wide px-2 py-1 rounded-sm mb-1.5">
                                                            {site.mainBonusText || site.joiningBonus}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                                                        <Star className="w-4 h-4 fill-current" />
                                                        {site.rating}/10
                                                    </div>
                                                </div>
                                            </div>

                                            <a
                                                href={site.slug ? `/${site.slug}` : '#'}
                                                className="w-full block text-center py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity rounded-sm"
                                            >
                                                {site.ctaText || "Claim Bonus"}
                                            </a>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href="/offers"
                                    className="block mt-4 text-center text-xs font-bold text-gray-400 hover:text-black dark:hover:text-white uppercase tracking-wider transition-colors"
                                >
                                    View All Offers →
                                </Link>
                            </div>
                        )}

                    </aside>
                </div>
            </div>
        </div>
    );
}

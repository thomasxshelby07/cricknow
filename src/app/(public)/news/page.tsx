import Link from "next/link";
import { Metadata } from "next";
import connectToDatabase from "@/lib/db";
import { News } from "@/models/News";
import { BettingSite } from "@/models/BettingSite";
import { ArrowRight, Calendar, Clock, ChevronRight, Star, Trophy, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { FeaturedSlider } from "@/components/public/FeaturedSlider";

export const metadata: Metadata = {
    title: "Latest Cricket News & Updates | Cricknow",
    description: "Stay updated with the latest cricket news, match analysis, and player updates.",
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getNewsData(category?: string) {
    await connectToDatabase();

    const query: any = { 'visibility.status': 'published' };
    if (category && category !== 'All') {
        query.category = category;
    }

    // Fetch Featured News (Array for Slider)
    // Fetch Featured News (Limit to top 5 for Slider)
    let featuredNews: any[] = [];
    if (!category || category === 'All') {
        featuredNews = await News.find({ ...query, isFeatured: true })
            .sort({ priority: -1, createdAt: -1 })
            .limit(5)
            .lean();
    }

    // Fetch Latest News (Exclude ONLY the featured ones being shown)
    const featuredIds = featuredNews.map(n => n._id.toString());
    const newsQuery = { ...query };

    // We exclude the specific IDs shown in the slider, NOT all featured items.
    // This allows "older" featured items to spill over into the latest list if they don't make the top 5 cut.
    if (featuredIds.length > 0) {
        newsQuery._id = { $nin: featuredIds };
    }

    const latestNews = await News.find(newsQuery)
        .sort({ priority: -1, createdAt: -1 })
        .limit(20)
        .lean();

    return { featuredNews, latestNews };
}

async function getSidebarSites() {
    await connectToDatabase();
    return await BettingSite.find({
        'visibility.status': 'published',
        showOnNewsSidebar: true
    })
        .select('name slug logoUrl rating ctaText mainBonusText joiningBonus')
        .sort({ 'visibility.displayOrder': 1 })
        .limit(5)
        .lean();
}

export default async function NewsPage({ searchParams }: { searchParams: { category?: string } }) {
    const category = searchParams.category || 'All';
    const { featuredNews, latestNews } = await getNewsData(category);
    const sidebarSites = await getSidebarSites();

    const categories = ['All', 'Cricket Betting', 'Casino News', 'Platform Updates', 'General', 'Betting News'];

    return (
        <div className="bg-white dark:bg-black min-h-screen font-sans">
            {/* Header - Simplified Black Theme */}
            <div className="bg-black text-white py-8 md:py-12 px-4 border-b border-gray-800">
                <div className="container mx-auto text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-[10px] font-medium mb-3 uppercase tracking-widest">
                        Cricket World
                    </span>
                    <h1 className="text-2xl md:text-4xl font-black mb-2 uppercase tracking-tight">
                        Latest News & <span className="text-gray-400">Updates</span>
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-200 dark:border-gray-800">
                            {categories.map((cat) => (
                                <Link
                                    key={cat}
                                    href={cat === 'All' ? '/news' : `/news?category=${cat}`}
                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all uppercase tracking-wider border ${category === cat
                                        ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-md'
                                        : 'bg-transparent text-gray-500 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                                        }`}
                                >
                                    {cat}
                                </Link>
                            ))}
                        </div>

                        {/* Featured News Slider */}
                        {featuredNews.length > 0 && (category === 'All') && (
                            <section className="mb-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-2 h-8 bg-black dark:bg-white rounded-full"></span>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900 dark:text-white">Featured Stories</h2>
                                </div>
                                <FeaturedSlider items={JSON.parse(JSON.stringify(featuredNews))} basePath="/news" />
                            </section>
                        )}

                        {/* Latest News Grid */}
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <span className="w-2 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"></span>
                                <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900 dark:text-white">
                                    {category === 'All' ? 'Latest Updates' : `${category}`}
                                </h2>
                            </div>

                            {latestNews.length > 0 ? (
                                <div className="flex flex-col gap-8">
                                    {latestNews.map((item: any) => (
                                        <Link
                                            key={item._id}
                                            href={`/${item.slug}`}
                                            className="group flex flex-col md:flex-row gap-6 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-900/50 p-4 rounded-2xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800"
                                        >
                                            <div className="relative w-full md:w-64 aspect-video rounded-xl overflow-hidden shrink-0">
                                                <img
                                                    src={item.coverImageUrl || '/placeholder.jpg'}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                                />
                                                {item.category && (
                                                    <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded">
                                                        {item.category}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-col justify-center flex-1">
                                                <div className="text-xs text-gray-400 mb-2 font-mono uppercase">
                                                    {format(new Date(item.createdAt), 'MMM d, yyyy')}
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white mb-3 leading-snug group-hover:underline decoration-2 underline-offset-4">
                                                    {item.title}
                                                </h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 md:line-clamp-3 mb-4 leading-relaxed">
                                                    {item.summary}
                                                </p>
                                                <div className="text-sm font-bold text-black dark:text-white flex items-center group-hover:translate-x-1 transition-transform w-fit">
                                                    Read More <ArrowRight className="w-4 h-4 ml-1" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                                    <p className="text-gray-400">No news found.</p>
                                </div>
                            )}
                        </section>

                    </div>

                    {/* Sidebar Area */}
                    <aside className="lg:col-span-4 space-y-8">

                        {/* Betting Sites Widget - Native Look */}
                        <div className="pt-4">
                            <h3 className="text-sm font-black uppercase text-gray-400 mb-6 tracking-widest">
                                Exclusive Offers
                            </h3>

                            <div className="space-y-6">
                                {sidebarSites.length > 0 ? sidebarSites.map((site: any) => (
                                    <div key={site._id} className="group relative flex flex-col gap-3 pb-6 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-gray-50 dark:bg-gray-800 p-2 flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-700">
                                                <img src={site.logoUrl} alt={site.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-black text-lg text-neutral-900 dark:text-white leading-none mb-1">{site.name}</h4>
                                                {site.mainBonusText && (
                                                    <p className="text-xs text-center text-primary font-bold uppercase tracking-wider mb-2">
                                                        {site.mainBonusText}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    {site.rating}/10
                                                </div>
                                            </div>
                                        </div>

                                        <a
                                            href={site.slug ? `/${site.slug}` : '#'}
                                            className="w-full block text-center py-3 bg-black dark:bg-white text-white dark:text-black text-sm font-black uppercase tracking-wide rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-black/10 dark:shadow-white/10"
                                        >
                                            {site.ctaText || "Claim Bonus"}
                                        </a>
                                    </div>
                                )) : (
                                    <p className="text-gray-400 text-sm">No offers available.</p>
                                )}
                            </div>

                            <Link
                                href="/offers"
                                className="block mt-4 text-center text-xs font-bold text-gray-400 hover:text-black dark:hover:text-white uppercase tracking-wider transition-colors"
                            >
                                View All Offers →
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

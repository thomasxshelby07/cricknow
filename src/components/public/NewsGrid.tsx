import Link from "next/link";
import { ArrowRight, Calendar, Clock, ChevronRight } from "lucide-react";
import connectToDatabase from "@/lib/db";
import { News } from "@/models/News";
import { format } from "date-fns";

interface NewsGridProps {
    count?: number;
    title?: string;
    showLink?: boolean;
    manualIds?: string[];
}

async function getNews(count: number, manualIds?: string[]) {
    await connectToDatabase();

    if (manualIds && manualIds.length > 0) {
        const news = await News.find({
            _id: { $in: manualIds },
            'visibility.status': 'published',
            'visibility.showOnHome': true
        }).lean();

        return manualIds
            .map(id => news.find((n: any) => n._id.toString() === id))
            .filter(n => n !== undefined)
            .slice(0, count);
    }

    // Default to published only
    return await News.find({
        'visibility.status': 'published',
        'visibility.showOnHome': true // STRICT ENFORCEMENT
    })
        .sort({ createdAt: -1 })
        .limit(count)
        .lean();
}

export async function NewsGrid({ count = 3, title = "Latest News", showLink = true, manualIds }: NewsGridProps) {
    const newsItems = await getNews(Number(count), manualIds);

    // Empty State
    if (!newsItems || newsItems.length === 0) {
        return (
            <section className="py-12 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">{title}</h2>
                        <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Latest cricket news and updates will appear here soon.</p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-12 bg-gray-50/50 dark:bg-gray-950/50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight mb-1">
                            {title}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                            Stay updated with the latest cricket action and analysis
                        </p>
                    </div>
                    {showLink && (
                        <Link href="/news" className="group flex items-center gap-1.5 text-primary font-semibold hover:text-primary-dark transition-colors text-sm">
                            View All News
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                <ArrowRight className="h-3 w-3" />
                            </div>
                        </Link>
                    )}
                </div>

                {/* News Grid - More Compact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {newsItems.map((item: any, idx) => (
                        <Link
                            key={item._id}
                            href={`/${item.slug}`}
                            className="group flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Image Container - Reduced Aspect Ratio */}
                            <div className="relative aspect-[16/9] overflow-hidden">
                                {item.coverImageUrl ? (
                                    <img
                                        src={item.coverImageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                        <span className="text-xs font-medium">No Image</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Category Badge - Smaller */}
                                {item.category && (
                                    <span className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-neutral-900 dark:text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md shadow-sm z-10">
                                        {item.category}
                                    </span>
                                )}
                            </div>

                            {/* Content - More Compact Padding & Text */}
                            <div className="flex flex-col flex-1 p-4">
                                <div className="flex items-center gap-3 text-[10px] text-gray-500 dark:text-gray-400 mb-2 font-medium">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {format(new Date(item.createdAt), 'MMM d, yyyy')}
                                    </span>
                                    {item.readTime && (
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {item.readTime} min
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>

                                <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2 mb-4 flex-1 leading-relaxed">
                                    {item.summary || "Click to read full article."}
                                </p>

                                <div className="flex items-center text-primary font-bold text-xs mt-auto group/btn">
                                    Read Article
                                    <ChevronRight className="h-3 w-3 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

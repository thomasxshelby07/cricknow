import Link from "next/link";
import { ArrowRight, Calendar, User, FileText } from "lucide-react";
import connectToDatabase from "@/lib/db";
import { Blog } from "@/models/Blog";
import { format } from "date-fns";

interface BlogGridProps {
    count?: number;
    category?: string; // 'guides', 'news', etc.
    title?: string;
    manualIds?: string[]; // Admin Config
    showLink?: boolean;
    showOnHomeOnly?: boolean;
    excludeIds?: string[];
    showEmptyState?: boolean;
}

async function getBlogs(count: number, category?: string, manualIds?: string[], showOnHomeOnly?: boolean, excludeIds?: string[]) {
    await connectToDatabase();

    if (manualIds && manualIds.length > 0) {
        // ... existing manualIds logic ...
        // (If manualIds are provided, we usually want specifically those, but excludeIds could strictly filter even those if needed. 
        // For now, let's strictly filter excludeIds from the result if provided)
        const blogs = await Blog.find({
            _id: { $in: manualIds },
            'visibility.status': 'published'
        }).lean();

        let results = manualIds
            .map(id => blogs.find((b: any) => b._id.toString() === id))
            .filter(b => b !== undefined);

        if (excludeIds && excludeIds.length > 0) {
            results = results.filter((b: any) => !excludeIds.includes(b._id.toString()));
        }

        return results.slice(0, count);
    }

    let query: any = { 'visibility.status': 'published' };
    if (category && category !== 'all') query.category = category;
    if (showOnHomeOnly) query['visibility.showOnHome'] = true;

    if (excludeIds && excludeIds.length > 0) {
        query._id = { $nin: excludeIds };
    }

    return await Blog.find(query)
        .sort({ isFeatured: -1, createdAt: -1 })
        .limit(count)
        .lean();
}

export async function BlogGrid({ count = 3, category = "all", title = "Latest Updates", showLink = true, manualIds, showOnHomeOnly = false, excludeIds, showEmptyState = false }: BlogGridProps) {
    const blogs = await getBlogs(Number(count), category, manualIds, showOnHomeOnly, excludeIds);

    // DUMMY STATE (MANDATORY)
    if (!blogs || blogs.length === 0) {
        return (
            <section className="py-12 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-neutral-dark dark:text-white capitalize">
                            {title}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Dummy Card */}
                        <article className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 opacity-60">
                            <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                <FileText className="w-12 h-12 text-gray-300" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-3 text-gray-400">
                                    SEO-Optimized Betting Blogs Coming Soon
                                </h3>
                                <p className="text-gray-400 text-sm mb-4">
                                    Our experts are writing comprehensive guides to help you win. Stay tuned.
                                </p>
                                <span className="text-gray-400 font-medium text-sm cursor-not-allowed">
                                    Read More
                                </span>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-neutral-dark dark:text-white capitalize">
                        {title} {category !== 'all' && <span className="text-gray-400 font-normal ml-2">({category})</span>}
                    </h2>
                    {showLink && (
                        <Link href="/blogs" className="text-primary text-sm font-medium hover:underline flex items-center">
                            Read More <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {blogs.map((blog: any) => (
                        <Link
                            href={`/${blog.slug}`}
                            key={blog._id}
                            className="group flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700/50 transition-all duration-300 hover:-translate-y-1 h-full"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[3/2] overflow-hidden">
                                {blog.coverImageUrl ? (
                                    <img
                                        src={blog.coverImageUrl}
                                        alt={blog.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400">
                                        <FileText className="w-10 h-10 opacity-50" />
                                    </div>
                                )}

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-50 group-hover:opacity-30 transition-opacity" />

                                {/* Category Badge - Smaller & Compact */}
                                <div className="absolute top-2 left-2 bg-white/95 dark:bg-black/90 backdrop-blur-md text-[9px] font-bold px-2 py-0.5 rounded-md text-black dark:text-white uppercase tracking-wider shadow-sm z-10">
                                    {blog.category}
                                </div>

                                {blog.isFeatured && (
                                    <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[9px] font-black px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider z-10">
                                        Featured
                                    </div>
                                )}
                            </div>

                            {/* Content - Compact Padding */}
                            <div className="flex flex-col flex-1 p-3.5">
                                {/* Meta Info - Compact */}
                                <div className="flex items-center gap-3 text-[10px] sm:text-xs font-medium text-gray-400 mb-2">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {format(new Date(blog.createdAt), 'MMM d')}
                                    </span>
                                    <div className="w-0.5 h-0.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                                    <span className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        Editor
                                    </span>
                                </div>

                                {/* Title - Smaller but Bold */}
                                <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                    {blog.title}
                                </h3>

                                {/* Excerpt - Shorter */}
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1 leading-relaxed">
                                    {blog.excerpt || "Expert insights and strategies for betting."}
                                </p>

                                {/* Read More - Subtle */}
                                <div className="flex items-center text-xs font-bold text-black dark:text-white group-hover:translate-x-1 transition-transform mt-auto text-primary">
                                    Read Article <ArrowRight className="ml-1 w-3 h-3" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

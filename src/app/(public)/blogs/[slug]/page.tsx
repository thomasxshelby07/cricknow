import { notFound } from "next/navigation";
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, ExternalLink, Star, ChevronRight } from 'lucide-react';
import connectToDatabase from "@/lib/db";
import { Blog } from "@/models/Blog";
import { BettingSite } from "@/models/BettingSite"; // Ensure model is registered
import { format } from "date-fns";
import { Button } from '@/components/ui/button';
import { getAdsForPage } from "@/lib/ads";
import { SidebarAd } from "@/components/ads/SidebarAd";
import { ContentWithAds } from "@/components/ads/ContentWithAds";

export const dynamic = 'force-dynamic';

async function getBlog(slug: string) {
    await connectToDatabase();

    // Ensure models are registered
    const _ = BettingSite;

    return await Blog.findOne({
        slug: slug,
        'visibility.status': 'published'
    })
        .populate('relatedSites', 'name slug logoUrl rating ctaText joiningBonus affiliateLink')
        .populate('relatedBlogs', 'title slug coverImageUrl createdAt excerpt')
        .populate('relatedNews', 'title slug coverImageUrl createdAt summary')
        .lean();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const blog = await getBlog(slug);

    if (!blog) {
        return {
            title: "Blog Not Found | Cricknow",
            description: "The article you are looking for does not exist."
        };
    }

    return {
        title: blog.seo?.metaTitle || `${blog.title} | Cricknow Blog`,
        description: blog.seo?.metaDescription || blog.excerpt || `Read about ${blog.title}`,
        keywords: blog.seo?.focusKeywords || [],
        openGraph: {
            title: blog.seo?.metaTitle || blog.title,
            description: blog.seo?.metaDescription || blog.excerpt,
            images: blog.coverImageUrl ? [{ url: blog.coverImageUrl }] : [],
        },
        alternates: {
            canonical: blog.seo?.canonicalUrl || `${process.env.NEXT_PUBLIC_APP_URL}/blogs/${blog.slug}`
        },
        robots: {
            index: !blog.seo?.noIndex,
            follow: !blog.seo?.noFollow
        }
    };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const blog = await getBlog(slug);

    if (!blog) {
        notFound();
    }

    const ads = await getAdsForPage('blog', String(blog._id));

    if (!blog) {
        notFound();
    }

    // JSON-LD Construction
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.seo?.metaTitle || blog.title,
        "datePublished": blog.createdAt,
        "dateModified": blog.updatedAt,
        "image": blog.coverImageUrl ? [blog.coverImageUrl] : [],
        "articleBody": blog.excerpt, // Using excerpt as summary/body representation for simplified schema
        "author": {
            "@type": "Organization",
            "name": "Cricknow"
        },
        ...((blog.seo?.structuredData && JSON.parse(blog.seo.structuredData)) || {})
    };

    return (
        <article className="min-h-screen bg-white dark:bg-gray-950 pb-20">
            {/* JSON-LD Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section */}
            <div className="relative w-full h-[40vh] md:h-[50vh] bg-neutral-900">
                {blog.coverImageUrl && (
                    <img
                        src={blog.coverImageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover opacity-60"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-10 mb-2 container mx-auto">
                    <Link href="/blogs" className="inline-flex items-center text-white/80 hover:text-white mb-4 text-xs md:text-sm font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blogs
                    </Link>

                    {blog.category && (
                        <span className="block w-fit px-2.5 py-0.5 bg-primary text-white text-[10px] md:text-xs font-bold rounded mb-3 uppercase tracking-wider shadow-sm">
                            {blog.category}
                        </span>
                    )}

                    <h1 className="text-2xl md:text-4xl font-black text-white mb-4 leading-tight max-w-4xl drop-shadow-lg">
                        {blog.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-gray-300 text-xs md:text-sm font-medium">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>{format(new Date(blog.createdAt), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>5 min read</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">

                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <div className="prose prose-base md:prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-neutral-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-blue-600 prose-img:rounded-xl prose-img:shadow-lg prose-blockquote:border-l-primary prose-li:marker:text-primary">
                            {blog.excerpt && (
                                <p className="lead italic text-gray-700 dark:text-gray-200 border-l-4 border-primary pl-4">
                                    {blog.excerpt}
                                </p>
                            )}
                            <ContentWithAds content={blog.content || ""} ads={ads} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">

                        <SidebarAd ads={ads} />

                        {/* 1. Related Betting Sites (Premier Ad Style) */}
                        {blog.relatedSites && blog.relatedSites.length > 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-1">
                                    <h3 className="text-xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
                                        <Star className="w-6 h-6 text-yellow-500 fill-current" />
                                        Top Picks
                                    </h3>
                                    <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded">Sponsored</span>
                                </div>

                                <div className="space-y-5">
                                    {blog.relatedSites.map((site: any) => (
                                        <div key={site._id} className="group relative bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
                                            {/* Shine Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 z-10 pointer-events-none" />

                                            <div className="flex items-start justify-between gap-3 mb-2 relative z-20">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg bg-white p-1 shadow-sm border border-gray-50 flex items-center justify-center shrink-0">
                                                        <img src={site.logoUrl} alt={site.name} className="w-full h-full object-contain" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-base text-neutral-900 dark:text-white leading-none mb-1">{site.name}</h4>
                                                        <div className="flex items-center gap-1">
                                                            <div className="flex text-yellow-400">
                                                                <Star className="w-3 h-3 fill-current" />
                                                                <Star className="w-3 h-3 fill-current" />
                                                                <Star className="w-3 h-3 fill-current" />
                                                                <Star className="w-3 h-3 fill-current" />
                                                                <Star className="w-3 h-3 fill-current" />
                                                            </div>
                                                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 ml-1">{site.rating}/10</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {site.joiningBonus && (
                                                <div className="mb-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800 rounded-lg p-2 text-center relative z-20">
                                                    <p className="text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wide mb-0.5">Exclusive Offer</p>
                                                    <p className="font-bold text-xs text-neutral-800 dark:text-neutral-100 leading-tight">{site.joiningBonus}</p>
                                                </div>
                                            )}

                                            <a
                                                href={site.affiliateLink || "#"}
                                                target="_blank"
                                                rel="nofollow noreferrer"
                                                className="block relative z-20"
                                            >
                                                <Button className="w-full h-9 text-sm font-bold bg-neutral-900 text-white hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-gray-100 shadow-sm transform active:scale-95 transition-all">
                                                    Play Now
                                                    <ChevronRight className="w-3 h-3 ml-1 opacity-60" />
                                                </Button>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 2. Related Blogs (Compact List) */}
                        {blog.relatedBlogs && blog.relatedBlogs.length > 0 && (
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                <h3 className="text-lg font-bold mb-5 text-neutral-900 dark:text-white px-1 flex items-center gap-2">
                                    <ExternalLink className="w-5 h-5 text-primary" />
                                    Trending Stories
                                </h3>
                                <div className="space-y-4">
                                    {blog.relatedBlogs.map((item: any) => (
                                        <Link key={item._id} href={`/blogs/${item.slug}`} className="group flex gap-3 items-center p-2 -mx-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                                            <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100 relative shadow-sm">
                                                {item.coverImageUrl ? (
                                                    <img src={item.coverImageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-400 mb-1">
                                                    <span>Article</span>
                                                    <span>•</span>
                                                    <span>{format(new Date(item.createdAt), 'MMM d')}</span>
                                                </div>
                                                <h4 className="text-sm font-bold leading-snug text-neutral-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                                                    {item.title}
                                                </h4>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 3. Related News (Compact List) */}
                        {blog.relatedNews && blog.relatedNews.length > 0 && (
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                <h3 className="text-lg font-bold mb-5 text-neutral-900 dark:text-white px-1">
                                    Latest News
                                </h3>
                                <div className="space-y-4">
                                    {blog.relatedNews.map((item: any) => (
                                        <Link key={item._id} href={`/news/${item.slug}`} className="group flex gap-3 items-center p-2 -mx-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                                            <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100 relative shadow-sm">
                                                {item.coverImageUrl ? (
                                                    <img src={item.coverImageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-400 mb-1">
                                                    <span>News</span>
                                                    <span>•</span>
                                                    <span>{format(new Date(item.createdAt), 'MMM d')}</span>
                                                </div>
                                                <h4 className="text-sm font-bold leading-snug text-neutral-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                                                    {item.title}
                                                </h4>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CTA Fallback if no related sites */}
                        {(!blog.relatedSites || blog.relatedSites.length === 0) && (
                            <div className="bg-gradient-to-br from-neutral-900 to-black text-white p-8 rounded-2xl text-center shadow-lg">
                                <h3 className="text-xl font-bold mb-2">Join our Telegram</h3>
                                <p className="text-gray-400 text-sm mb-6">Get premium betting tips and instant news updates.</p>
                                <Button variant="secondary" className="w-full font-bold">
                                    Join Now
                                </Button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </article>
    );
}

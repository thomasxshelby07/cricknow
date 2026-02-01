import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Facebook, Linkedin, Share2, Timer, Twitter, Star, ChevronRight, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarAd } from "@/components/ads/SidebarAd";
import { ContentWithAds } from "@/components/ads/ContentWithAds";
import { CouponBanner } from "@/components/public/CouponBanner";

export function NewsDetailView({ news, ads, coupons = [] }: { news: any, ads: any[], coupons?: any[] }) {
    if (!news) return null;

    // JSON-LD Construction
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": news.seo?.metaTitle || news.title,
        "datePublished": news.createdAt,
        "dateModified": news.lastUpdated || news.updatedAt,
        "image": news.coverImageUrl ? [news.coverImageUrl] : [],
        "articleBody": news.summary,
        ...((news.seo?.structuredData && JSON.parse(news.seo.structuredData)) || {})
    };

    return (
        <article className="min-h-screen bg-white dark:bg-gray-950 pb-20">
            {/* JSON-LD Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {news.faqs?.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": news.faqs.map((f: any) => ({
                                "@type": "Question",
                                "name": f.question,
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": f.answer
                                }
                            }))
                        })
                    }}
                />
            )}

            {/* Hero Section */}
            <div className="relative w-full h-[50vh] md:h-[60vh] bg-neutral-900">
                {news.coverImageUrl && (
                    <img
                        src={news.coverImageUrl}
                        alt={news.title}
                        className="w-full h-full object-cover opacity-60"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 mb-4 container mx-auto">
                    <Link href="/news" className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to News
                    </Link>

                    {news.category && (
                        <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-4">
                            {news.category}
                        </span>
                    )}

                    <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight max-w-4xl drop-shadow-2xl">
                        {news.customH1 || news.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-gray-300 text-sm md:text-base font-medium">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span>{format(new Date(news.createdAt), 'MMMM dd, yyyy')}</span>
                        </div>
                        {news.lastUpdated && (
                            <div className="flex items-center gap-2 text-green-400">
                                <Clock className="w-5 h-5" />
                                <span>Updated: {format(new Date(news.lastUpdated), 'MMMM dd, yyyy')}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Coupon Strip - Below Header */}
            {news.relatedCoupons && news.relatedCoupons.length > 0 && (
                <div className="bg-white dark:bg-black py-2 md:py-3 mb-6">
                    <div className="container mx-auto px-2 md:px-4">
                        <div className="w-full">
                            {news.relatedCoupons.slice(0, 1).map((coupon: any) => (
                                <CouponBanner
                                    key={coupon._id}
                                    coupon={{
                                        _id: coupon._id,
                                        title: coupon.name,
                                        description: coupon.offer,
                                        bonusCode: coupon.couponCode,
                                        bonusAmount: coupon.bonusAmount,
                                        ctaText: coupon.buttonText,
                                        redirectUrl: coupon.redirectLink,
                                        images: {
                                            horizontal: coupon.imageUrl,
                                            vertical: coupon.imageUrl,
                                        },
                                    }}
                                    variant="horizontal"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <div className="prose prose-lg md:prose-xl max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-neutral-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-blue-600 prose-img:rounded-xl prose-img:shadow-lg prose-blockquote:border-l-primary prose-li:marker:text-primary">
                            {news.summary && (
                                <p className="lead italic text-gray-700 dark:text-gray-200 border-l-4 border-primary pl-4">
                                    {news.summary}
                                </p>
                            )}
                            <ContentWithAds content={news.content || ""} ads={ads} />
                        </div>

                        {/* FAQs Section */}
                        {news.faqs?.length > 0 && (
                            <div className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800">
                                <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
                                <div className="space-y-4">
                                    {news.faqs.map((faq: any, i: number) => (
                                        <div key={i} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
                                            <h4 className="font-bold text-lg mb-2">{faq.question}</h4>
                                            <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">

                        <SidebarAd ads={ads} />



                        {/* 1. Related Betting Sites (High Impact / Ad Style) */}
                        {news.relatedSites && news.relatedSites.length > 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-1">
                                    <h3 className="text-xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
                                        <Star className="w-6 h-6 text-yellow-500 fill-current" />
                                        Top Picks
                                    </h3>
                                    <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded">Sponsored</span>
                                </div>

                                <div className="space-y-5">
                                    {news.relatedSites.map((site: any) => (
                                        <div key={site._id} className="group relative bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
                                            {/* Shine Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 z-10 pointer-events-none" />

                                            <div className="flex items-start justify-between gap-4 mb-3 relative z-20">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-14 h-14 rounded-xl bg-white p-1 shadow-sm border-2 border-gray-50 flex items-center justify-center shrink-0">
                                                        <img src={site.logoUrl} alt={site.name} className="w-full h-full object-contain" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-extrabold text-lg text-neutral-900 dark:text-white leading-none mb-1">{site.name}</h4>
                                                        <div className="flex items-center gap-1">
                                                            <div className="flex text-yellow-400">
                                                                <Star className="w-3.5 h-3.5 fill-current" />
                                                                <Star className="w-3.5 h-3.5 fill-current" />
                                                                <Star className="w-3.5 h-3.5 fill-current" />
                                                                <Star className="w-3.5 h-3.5 fill-current" />
                                                                <Star className="w-3.5 h-3.5 fill-current" />
                                                            </div>
                                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">{site.rating}/10</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {site.joiningBonus && (
                                                <div className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800 rounded-lg p-2.5 text-center relative z-20">
                                                    <p className="text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wide mb-0.5">Exclusive Offer</p>
                                                    <p className="font-black text-sm text-neutral-800 dark:text-neutral-100 leading-tight">{site.joiningBonus}</p>
                                                </div>
                                            )}

                                            <a
                                                href={site.affiliateLink || "#"}
                                                target="_blank"
                                                rel="nofollow noreferrer"
                                                className="block relative z-20"
                                            >
                                                <Button className="w-full h-11 text-base font-bold bg-neutral-900 text-white hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-gray-100 shadow-md transform active:scale-95 transition-all">
                                                    Play Now
                                                    <ChevronRight className="w-4 h-4 ml-1 opacity-60" />
                                                </Button>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 2. Related News (Compact List) */}
                        {news.relatedNews && news.relatedNews.length > 0 && (
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                <h3 className="text-lg font-bold mb-5 text-neutral-900 dark:text-white px-1">
                                    Trending News
                                </h3>
                                <div className="space-y-4">
                                    {news.relatedNews.map((item: any) => (
                                        <Link key={item._id} href={`/${item.slug}`} className="group flex gap-3 items-center p-2 -mx-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
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

                        {/* 3. Related Blogs (Compact List) */}
                        {news.relatedBlogs && news.relatedBlogs.length > 0 && (
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                <h3 className="text-lg font-bold mb-5 text-neutral-900 dark:text-white px-1">
                                    Recommended Reads
                                </h3>
                                <div className="space-y-4">
                                    {news.relatedBlogs.map((item: any) => (
                                        <Link key={item._id} href={`/${item.slug}`} className="group flex gap-3 items-center p-2 -mx-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                                            <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100 relative shadow-sm">
                                                {item.coverImageUrl ? (
                                                    <img src={item.coverImageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-400 mb-1">
                                                    <span>Blog</span>
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

                        {/* 3. Internal Links Widget (Existing) */}
                        {news.internalLinks?.length > 0 && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800/50">
                                <h3 className="text-lg font-bold mb-4 text-blue-900 dark:text-blue-100">See Also</h3>
                                <div className="space-y-2">
                                    {news.internalLinks.map((link: any, i: number) => (
                                        <Link key={i} href={link.url} className="block group">
                                            <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-200 transition-colors">
                                                <ChevronRight className="w-4 h-4 text-blue-400" />
                                                {link.title}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="bg-gradient-to-br from-neutral-900 to-black text-white p-8 rounded-2xl text-center shadow-lg">
                            <h3 className="text-xl font-bold mb-2">Join our Telegram</h3>
                            <p className="text-gray-400 text-sm mb-6">Get premium betting tips and instant news updates.</p>
                            <Button variant="secondary" className="w-full font-bold">
                                Join Now
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </article>
    );
}

import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Facebook, Linkedin, Share2, Timer, Twitter, Star, ChevronRight, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarAd } from "@/components/ads/SidebarAd";
import { ContentWithAds } from "@/components/ads/ContentWithAds";
import { CouponBanner } from "@/components/public/CouponBanner";

export function BlogDetailView({ blog, ads, coupons = [] }: { blog: any, ads: any[], coupons?: any[] }) {
    if (!blog) return null;

    // JSON-LD Construction
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.seo?.metaTitle || blog.title,
        "datePublished": blog.createdAt,
        "dateModified": blog.lastUpdated || blog.updatedAt,
        "image": blog.coverImageUrl ? [blog.coverImageUrl] : [],
        "articleBody": blog.excerpt,
        "author": {
            "@type": "Person",
            "name": blog.author || "CricKnow Editor"
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
            {blog.faqs?.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": blog.faqs.map((f: any) => ({
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
                {blog.coverImageUrl && (
                    <img
                        src={blog.coverImageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover opacity-60"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 mb-4 container mx-auto">
                    <Link href="/blogs" className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
                    </Link>

                    {blog.category && (
                        <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-4">
                            {blog.category}
                        </span>
                    )}

                    <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight max-w-4xl drop-shadow-2xl">
                        {blog.customH1 || blog.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-gray-300 text-sm md:text-base font-medium">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-white text-xs">
                                {blog.author?.[0] || "A"}
                            </div>
                            <span>{blog.author || "Admin"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span>{format(new Date(blog.createdAt), 'MMMM dd, yyyy')}</span>
                        </div>
                        {blog.readTime && (
                            <div className="flex items-center gap-2">
                                <Timer className="w-5 h-5 text-primary" />
                                <span>{blog.readTime} min read</span>
                            </div>
                        )}
                        {blog.lastUpdated && (
                            <div className="flex items-center gap-2 text-green-400">
                                <Clock className="w-5 h-5" />
                                <span>Updated: {format(new Date(blog.lastUpdated), 'MMMM dd, yyyy')}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Coupon Strip - Below Header */}
            {blog.relatedCoupons && blog.relatedCoupons.length > 0 && (
                <div className="bg-white dark:bg-black py-2 md:py-3 mb-6">
                    <div className="container mx-auto px-2 md:px-4">
                        <div className="w-full">
                            {blog.relatedCoupons.slice(0, 1).map((coupon: any) => (
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



                        {/* 1. Related Betting Sites (Native Ad Style) */}
                        {blog.relatedSites && blog.relatedSites.length > 0 && (
                            <div className="pt-4">
                                <h3 className="text-sm font-black uppercase text-gray-400 mb-6 tracking-widest">
                                    Exclusive Offers
                                </h3>

                                <div className="space-y-6">
                                    {blog.relatedSites.map((site: any) => (
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
                                                href={site.affiliateLink || (site.slug ? `/${site.slug}` : '#')}
                                                target={site.affiliateLink ? "_blank" : "_self"}
                                                rel={site.affiliateLink ? "nofollow noreferrer" : ""}
                                                className="w-full block text-center py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity rounded-sm"
                                            >
                                                {site.ctaText || "Claim Bonus"}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 2. Related News (List) */}
                        {blog.relatedNews && blog.relatedNews.length > 0 && (
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                <h3 className="text-lg font-bold mb-5 text-neutral-900 dark:text-white px-1">
                                    Trending News
                                </h3>
                                <div className="space-y-4">
                                    {blog.relatedNews.map((item: any) => (
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

                        {/* 3. Related Blogs (List) */}
                        {blog.relatedBlogs && blog.relatedBlogs.length > 0 && (
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                <h3 className="text-lg font-bold mb-5 text-neutral-900 dark:text-white px-1">
                                    More to Read
                                </h3>
                                <div className="space-y-4">
                                    {blog.relatedBlogs.map((item: any) => (
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

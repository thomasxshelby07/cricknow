import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle, XCircle, ExternalLink, ShieldCheck, Calendar, Globe, Building2, ChevronRight, Home } from "lucide-react";
import connectToDatabase from "@/lib/db";
import { BettingSite } from "@/models/BettingSite";
import { cn } from "@/lib/utils";

// Force dynamic rendering to ensure DB updates are reflected immediately
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Fetch site data
async function getSite(slug: string) {
    await connectToDatabase();
    // Using lean() is good for performance, but ensure caching is disabled above
    const site = await BettingSite.findOne({ slug, 'visibility.status': 'published' }).lean();
    return site;
}

// Generate Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const site = await getSite(slug);
    if (!site) return { title: "Site Not Found" };

    return {
        title: site.seo?.metaTitle || `${site.name} Review & Bonus`,
        description: site.seo?.metaDescription || `Read our honest review of ${site.name}. Check rating, bonus offers, pros and cons.`,
        keywords: site.seo?.focusKeywords || [`${site.name} review`, `${site.name} bonus`, "betting sites India"],
        alternates: {
            canonical: site.seo?.canonicalUrl || `https://cricknow.com/sites/${slug}`,
        },
        openGraph: {
            title: site.seo?.metaTitle || `${site.name} Review & Bonus`,
            description: site.seo?.metaDescription || `Read our honest review of ${site.name}. Check rating, bonus offers, pros and cons.`,
            url: `https://cricknow.com/sites/${slug}`,
            siteName: 'CricKnow',
            images: [
                {
                    url: site.coverImageUrl || '/og-default.jpg', // Fallback image
                    width: 1200,
                    height: 630,
                    alt: `${site.name} Review`,
                },
            ],
            locale: 'en_IN',
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: site.seo?.metaTitle || `${site.name} Review`,
            description: site.seo?.metaDescription || `Read our honest review of ${site.name}.`,
            images: [site.coverImageUrl || '/og-default.jpg'],
        },
        robots: {
            index: !site.seo?.noIndex,
            follow: !site.seo?.noFollow,
            googleBot: {
                index: !site.seo?.noIndex,
                follow: !site.seo?.noFollow,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

export default async function SingleSitePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const site = await getSite(slug);

    const displaySite = site;

    if (!site) return notFound();

    // if (!site) { notFound(); } // Commented out for preview mode


    return (
        <div className="bg-gray-50 dark:bg-neutral-950 min-h-screen font-sans">
            {/* Premium Hero Banner */}
            <div className="relative bg-neutral-900 border-b border-gray-800">
                {/* Background Image with Overlay */}
                {displaySite.coverImageUrl && (
                    <div className="absolute inset-0 z-0">
                        <img src={displaySite.coverImageUrl} alt="Cover" className="w-full h-full object-cover opacity-20 blur-sm" />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent"></div>
                    </div>
                )}

                <div className="container mx-auto px-4 relative z-10 py-12 md:py-20 text-center">
                    <span className="inline-block px-3 py-1 bg-white text-black text-xs font-bold rounded-full uppercase tracking-wide mb-4 shadow-lg">Verified Review</span>

                    {displaySite.lastUpdated && (
                        <div className="flex items-center justify-center gap-2 mb-2 text-xs font-medium text-green-400 bg-green-400/10 inline-block px-3 py-1 rounded-full border border-green-400/20">
                            <span className="flex items-center gap-1">✅ Last Updated: {new Date(displaySite.lastUpdated).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    )}

                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-md leading-tight">
                        {displaySite.customH1 || displaySite.reviewTitle || `${displaySite.name} Review 2025`}
                    </h1>
                    {displaySite.foundedYear && (
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto font-medium">
                            Comprehensive analysis of {displaySite.name}. {displaySite.owner ? `Owned by ${displaySite.owner}.` : ""}
                        </p>
                    )}
                </div>
            </div>

            {/* Breadcrumb Bar */}
            <div className="bg-white dark:bg-neutral-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20 shadow-sm/50 backdrop-blur-md bg-white/90 dark:bg-neutral-900/90">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Link href="/" className="hover:text-black dark:hover:text-white flex items-center gap-1"><Home className="w-3 h-3" /> Home</Link>
                        <ChevronRight className="w-4 h-4 mx-1" />
                        <Link href="/betting-sites" className="hover:text-black dark:hover:text-white">Betting Sites</Link>
                        <ChevronRight className="w-4 h-4 mx-1" />
                        <span className="text-black dark:text-white font-semibold truncate">{displaySite.name}</span>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* LEFT COLUMN: Main Content */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Gallery Grid (Clean, No Header as requested) */}
                        {displaySite.gallery?.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {displaySite.gallery.map((img: string, i: number) => (
                                    <div key={i} className="rounded-xl overflow-hidden border border-gray-100 shadow-sm cursor-zoom-in">
                                        <img src={img} alt={`${displaySite.name} visual ${i + 1}`} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pros & Cons Cards */}
                        {(displaySite.pros?.length > 0 || displaySite.cons?.length > 0) && (
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-green-50/50 dark:bg-green-900/10 p-6 rounded-2xl border border-green-100 dark:border-green-900/30">
                                    <h3 className="flex items-center gap-2 font-bold text-green-700 dark:text-green-400 mb-4 text-xl">
                                        <CheckCircle className="w-6 h-6" /> The Good
                                    </h3>
                                    <ul className="space-y-3">
                                        {displaySite.pros?.map((pro: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-neutral-800 dark:text-neutral-200 text-sm font-medium">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></div>
                                                {pro}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-red-50/50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/30">
                                    <h3 className="flex items-center gap-2 font-bold text-red-600 dark:text-red-400 mb-4 text-xl">
                                        <XCircle className="w-6 h-6" /> The Bad
                                    </h3>
                                    <ul className="space-y-3">
                                        {displaySite.cons?.map((con: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-neutral-800 dark:text-neutral-200 text-sm font-medium">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></div>
                                                {con}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Main Review Content */}
                        <div
                            className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-neutral-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-blue-600 prose-img:rounded-2xl prose-img:shadow-lg"
                            dangerouslySetInnerHTML={{ __html: displaySite.reviewContent || displaySite.fullDescription || "" }}
                        />

                        {/* Comparison Table / Content */}
                        {displaySite.comparisonContent && (
                            <div className="py-8 border-t border-gray-100 dark:border-gray-800">
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Comparison: {displaySite.name} vs Others</h2>
                                <div
                                    className="prose prose-lg max-w-none dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: displaySite.comparisonContent }}
                                />
                            </div>
                        )}

                        {/* Internal Linking Strategy */}
                        {displaySite.internalLinks?.length > 0 && (
                            <div className="py-8 border-t border-gray-100 dark:border-gray-800">
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Related Reading</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {displaySite.internalLinks.map((link: any, i: number) => (
                                        <Link key={i} href={link.url} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-gray-800 hover:border-gray-300 transition-colors group">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                                {link.type === 'comparison' ? 'VS' : <ExternalLink className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-neutral-900 dark:text-white">{link.title}</p>
                                                <p className="text-xs text-capitalize text-gray-500">{link.type}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Dynamic SEO Sections with Images */}
                        {displaySite.seoSections?.length > 0 && (
                            <div className="space-y-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                                {displaySite.seoSections.map((section: any, i: number) => (
                                    <div key={i} className="scroll-mt-24">
                                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">{section.title}</h2>

                                        {/* Optional Section Image */}
                                        {section.image && (
                                            <div className="mb-8 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-lg">
                                                <img src={section.image} alt={section.title} className="w-full h-auto max-h-[400px] object-cover" />
                                            </div>
                                        )}

                                        <div
                                            className="prose prose-lg max-w-none dark:prose-invert text-gray-600 dark:text-gray-300"
                                            dangerouslySetInnerHTML={{ __html: section.content }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* User Reviews Section */}
                        {displaySite.userReviews?.length > 0 && (
                            <div className="pt-12 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">User Reviews</h3>
                                    <div className="bg-neutral-900 dark:bg-neutral-800 px-4 py-2 rounded-full flex items-center gap-2 border border-neutral-700">
                                        <Star className="w-4 h-4 text-white fill-white" />
                                        <span className="font-bold text-white text-sm">Excellent Feedback</span>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {displaySite.userReviews.map((review: any, i: number) => (
                                        <div key={i} className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                                                        {review.user[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-neutral-900 dark:text-white leading-tight">{review.user}</h4>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <span>{review.date}</span>
                                                            {review.country && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span className="flex items-center gap-1 font-medium text-gray-700 dark:text-gray-300">
                                                                        <Globe className="w-3 h-3" /> {review.country}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-0.5 bg-gray-50 dark:bg-neutral-800 px-2 py-1 rounded-lg">
                                                    {Array.from({ length: 5 }).map((_, j) => (
                                                        <Star key={j} className={cn("w-3 h-3", j < review.rating ? "fill-black text-black dark:fill-white dark:text-white" : "fill-gray-200 text-gray-200")} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic">"{review.comment}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* FAQs Section */}
                        {displaySite.faqs?.length > 0 && (
                            <div className="pt-12 border-t border-gray-100 dark:border-gray-800">
                                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Frequently Asked Questions</h3>
                                <div className="space-y-4">
                                    {displaySite.faqs.map((faq: any, i: number) => (
                                        <div key={i} className="border border-gray-100 dark:border-gray-800 rounded-2xl p-6 bg-white dark:bg-neutral-900">
                                            <h4 className="font-bold text-lg text-neutral-900 dark:text-white mb-2">{faq.question}</h4>
                                            <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                                        </div>
                                    ))}
                                </div>
                                {/* JSON-LD for FAQPage */}
                                <script
                                    type="application/ld+json"
                                    dangerouslySetInnerHTML={{
                                        __html: JSON.stringify({
                                            "@context": "https://schema.org",
                                            "@type": "FAQPage",
                                            "mainEntity": displaySite.faqs.map((faq: any) => ({
                                                "@type": "Question",
                                                "name": faq.question,
                                                "acceptedAnswer": {
                                                    "@type": "Answer",
                                                    "text": faq.answer
                                                }
                                            }))
                                        })
                                    }}
                                />

                                {/* Custom Structured Data (Admin) */}
                                {displaySite.seo?.structuredData && (
                                    <script
                                        type="application/ld+json"
                                        dangerouslySetInnerHTML={{
                                            __html: displaySite.seo.structuredData
                                        }}
                                    />
                                )}
                            </div>
                        )}

                        <div className="bg-black dark:bg-white rounded-3xl p-8 md:p-12 text-center text-white dark:text-black shadow-2xl">
                            <h2 className="text-3xl font-black mb-4">Ready to Start Betting?</h2>
                            <p className="text-gray-400 dark:text-gray-600 text-lg mb-8 max-w-xl mx-auto">Claim your exclusive welcome bonus and join thousands of other players on {displaySite.name} today.</p>
                            <a href={displaySite.affiliateLink} target="_blank" rel="nofollow noreferrer">
                                <Button size="lg" className="h-14 px-10 rounded-full bg-white text-black dark:bg-black dark:text-white font-bold text-lg hover:scale-105 transition-all shadow-lg border-2 border-transparent hover:border-black dark:hover:border-white">
                                    Visit Site Now <ExternalLink className="ml-2 w-5 h-5" />
                                </Button>
                            </a>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar (Sticky) */}
                    <div className="lg:col-span-4 relative">
                        <div className="sticky top-28 space-y-6">

                            {/* Main CTA Card */}
                            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-900 via-gray-500 to-gray-900"></div>

                                <div className="w-24 h-24 mx-auto bg-white dark:bg-neutral-800 rounded-2xl flex items-center justify-center p-4 mb-4 border border-gray-100 shadow-sm">
                                    {displaySite.logoUrl ? (
                                        <img src={displaySite.logoUrl} alt={displaySite.name} className="max-w-full max-h-full object-contain" />
                                    ) : (
                                        <span className="text-3xl font-black text-gray-300">{displaySite.name[0]}</span>
                                    )}
                                </div>

                                <div className="flex items-center justify-center gap-1 mb-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={cn("w-6 h-6", i < Math.floor(displaySite.rating) ? "fill-black text-black dark:fill-white dark:text-white" : "fill-gray-200 text-gray-200")} />
                                    ))}
                                    <span className="text-2xl font-bold ml-1 text-neutral-900 dark:text-white">{displaySite.rating}</span>
                                </div>
                                <p className="text-sm text-gray-500 mb-6">Excellent Trust Score</p>

                                <div className="bg-gray-50 dark:bg-neutral-800 py-4 px-4 rounded-2xl mb-6 border border-dashed border-gray-200 dark:border-gray-700">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Exclusive Welcome Offer</p>
                                    <p className="text-2xl font-black text-neutral-900 dark:text-white leading-tight">{displaySite.joiningBonus || "100% Bonus"}</p>
                                </div>

                                <a href={displaySite.affiliateLink} target="_blank" rel="nofollow noreferrer" className="block w-full">
                                    <Button size="lg" className="w-full h-14 text-lg font-bold rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white shadow-lg shadow-neutral-900/20 transition-transform active:scale-95">
                                        Claim Bonus Now <ChevronRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </a>
                                <p className="text-xs text-center text-gray-400 mt-3">Terms & Conditions apply. 18+</p>
                            </div>

                            {/* Ratings Breakdown Card */}
                            {displaySite.ratings?.overall > 0 && (
                                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                                    <h3 className="font-bold text-neutral-900 dark:text-white mb-4">Rating Breakdown</h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: "Trust & Fairness", value: displaySite.ratings.trust },
                                            { label: "Games & Odds", value: displaySite.ratings.games },
                                            { label: "Bonuses", value: displaySite.ratings.bonus },
                                            { label: "Customer Support", value: displaySite.ratings.support },
                                        ].map((item) => (
                                            <div key={item.label} className="space-y-1">
                                                <div className="flex justify-between text-xs font-bold uppercase text-gray-500">
                                                    <span>{item.label}</span>
                                                    <span className="text-neutral-900 dark:text-white">{item.value}/10</span>
                                                </div>
                                                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-black dark:bg-white rounded-full"
                                                        style={{ width: `${(item.value / 10) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Info Card */}
                            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                                <h3 className="font-bold text-neutral-900 dark:text-white mb-4">Site Information</h3>
                                <ul className="space-y-4 text-sm">
                                    <li className="flex items-start justify-between">
                                        <span className="flex items-center gap-2 text-gray-500"><Building2 className="w-4 h-4" /> Owner</span>
                                        <span className="font-semibold text-neutral-900 dark:text-white text-right max-w-[150px]">{displaySite.owner || "N/A"}</span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-gray-500"><Calendar className="w-4 h-4" /> Established</span>
                                        <span className="font-semibold text-neutral-900 dark:text-white">{displaySite.foundedYear || "N/A"}</span>
                                    </li>
                                    <li className="flex items-start justify-between">
                                        <span className="flex items-center gap-2 text-gray-500"><ShieldCheck className="w-4 h-4" /> License</span>
                                        <span className="font-semibold text-neutral-900 dark:text-white text-right max-w-[150px]">{displaySite.licenses?.[0] || "Curacao"}</span>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

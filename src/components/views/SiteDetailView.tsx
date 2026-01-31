import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle, XCircle, ExternalLink, ShieldCheck, Calendar, Globe, Building2, ChevronRight, Home, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { StickySiteHeader } from "@/components/ui/StickySiteHeader"; // Import the client component

export function SiteDetailView({ site }: { site: any }) {
    if (!site) return null;

    const displaySite = site;

    return (
        <div className="bg-white dark:bg-black min-h-screen font-sans text-neutral-900 dark:text-neutral-100">

            {/* 1. Sticky Header (Scroll Logic handled internally) */}
            <StickySiteHeader siteName={displaySite.name} affiliateLink={displaySite.affiliateLink} />

            {/* Premium Hero Banner - Solid Black */}
            <div className="relative bg-black border-b border-gray-800 pt-24 pb-12 md:pt-28 md:pb-16">
                <div className="container mx-auto px-4 relative z-10 text-center">

                    {/* Breadcrumb - Centered for Hero */}
                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/betting-sites" className="hover:text-white transition-colors">Betting Sites</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-white">{displaySite.name}</span>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white text-[10px] font-bold rounded-full uppercase tracking-widest mb-4 border border-white/10">
                        <ShieldCheck className="w-3 h-3" /> Verified Review
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                        {displaySite.customH1 || displaySite.reviewTitle || `${displaySite.name} Review`}
                    </h1>

                    <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        Comprehensive analysis of {displaySite.name}. {displaySite.owner ? `Owned by ${displaySite.owner}.` : ""}
                    </p>

                    {displaySite.lastUpdated && (
                        <div className="mt-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            Last Updated: {new Date(displaySite.lastUpdated).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    )}
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* LEFT COLUMN: Main Content */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* === MOBILE EXCLUSIVE: Top Offer Section (Visible < lg) === */}
                        <div className="block lg:hidden bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-gray-200 dark:border-neutral-800 shadow-xl mb-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gray-50 dark:bg-white rounded-xl flex items-center justify-center p-2 border border-gray-100">
                                    {displaySite.logoUrl ? (
                                        <img src={displaySite.logoUrl} alt={displaySite.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-xl font-black text-gray-300">{displaySite.name[0]}</span>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-black dark:text-white leading-none">{displaySite.name}</h2>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Star className="w-3 h-3 fill-black text-black dark:fill-white dark:text-white" />
                                        <span className="text-sm font-bold">{displaySite.rating}/10</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl text-center border border-amber-100 dark:border-amber-900/20 mb-4">
                                <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-1">Exclusive Welcome Offer</p>
                                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500 leading-none">
                                    {displaySite.joiningBonus || "100% Bonus"}
                                </p>
                            </div>

                            <a href={displaySite.affiliateLink} target="_blank" rel="nofollow noreferrer" className="block w-full">
                                <Button className="w-full h-12 text-sm font-black uppercase tracking-widest rounded-xl bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white shadow-lg">
                                    Claim Bonus <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </a>
                        </div>
                        {/* ======================================================== */}


                        {/* Gallery Grid - Square Uniform Size */}
                        {displaySite.gallery?.length > 0 && (
                            <div className="grid grid-cols-2 gap-4">
                                {displaySite.gallery.map((img: string, i: number) => (
                                    <div key={i} className="rounded-xl border border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 aspect-square overflow-hidden">
                                        <img src={img} alt={`${displaySite.name} visual ${i + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Main Review Text */}
                        <div className="space-y-8">
                            {/* Pros & Cons - Compact */}
                            {(displaySite.pros?.length > 0 || displaySite.cons?.length > 0) && (
                                <div className="grid md:grid-cols-2 gap-6 p-6 bg-gray-50 dark:bg-neutral-900 rounded-3xl border border-gray-100 dark:border-neutral-800">
                                    <div>
                                        <h3 className="font-bold text-black dark:text-white mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Pros</h3>
                                        <ul className="space-y-2">
                                            {displaySite.pros?.map((pro: string, i: number) => (
                                                <li key={i} className="text-sm text-gray-600 dark:text-gray-400 pl-6 relative">
                                                    <span className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                    {pro}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-black dark:text-white mb-3 flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /> Cons</h3>
                                        <ul className="space-y-2">
                                            {displaySite.cons?.map((con: string, i: number) => (
                                                <li key={i} className="text-sm text-gray-600 dark:text-gray-400 pl-6 relative">
                                                    <span className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                                    {con}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            <div
                                className="prose prose-lg max-w-none dark:prose-invert 
                                prose-headings:font-black prose-headings:tracking-tight prose-headings:text-black dark:prose-headings:text-white 
                                prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                                prose-li:text-gray-600 dark:prose-li:text-gray-300
                                prose-strong:text-black dark:prose-strong:text-white prose-strong:font-bold
                                prose-img:rounded-2xl prose-img:shadow-lg prose-img:border prose-img:border-gray-100 dark:prose-img:border-neutral-800
                                prose-img:max-w-4xl prose-img:mx-auto prose-img:w-full"
                                dangerouslySetInnerHTML={{ __html: displaySite.reviewContent || displaySite.fullDescription || "" }}
                            />
                        </div>

                        {/* Comparison Table */}
                        {displaySite.comparisonContent && (
                            <div className="pt-12 border-t border-gray-100 dark:border-neutral-800">
                                <h2 className="text-3xl font-black text-black dark:text-white mb-8 tracking-tight">Comparison</h2>
                                <div
                                    className="prose prose-lg max-w-none dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: displaySite.comparisonContent }}
                                />
                            </div>
                        )}

                        {/* Dynamic SEO Sections - FIX: Max width for clean desktop view */}
                        {displaySite.seoSections?.length > 0 && (
                            <div className="space-y-20 pt-12 border-t border-gray-100 dark:border-neutral-800">
                                {displaySite.seoSections.map((section: any, i: number) => (
                                    <div key={i} className="scroll-mt-24">
                                        <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white mb-8 tracking-tighter">{section.title}</h2>

                                        {/* Auto-Sizing Image Container with Max Width */}
                                        {section.image && (
                                            <div className="mb-10 rounded-2xl overflow-hidden border border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 shadow-sm max-w-4xl mx-auto">
                                                <img src={section.image} alt={section.title} className="w-full h-auto block" />
                                            </div>
                                        )}

                                        <div
                                            className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-black prose-p:text-gray-600 dark:prose-p:text-gray-300"
                                            dangerouslySetInnerHTML={{ __html: section.content }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* User Reviews */}
                        {displaySite.userReviews?.length > 0 && (
                            <div className="pt-16 border-t border-gray-100 dark:border-neutral-800">
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-3xl font-black text-black dark:text-white tracking-tight">User Reviews</h3>
                                    <div className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span>Verified Feedback</span>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {displaySite.userReviews.map((review: any, i: number) => (
                                        <div key={i} className="p-8 bg-gray-50 dark:bg-neutral-900 rounded-3xl border border-gray-100 dark:border-neutral-800">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black text-lg">
                                                        {review.user[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-black dark:text-white text-lg">{review.user}</h4>
                                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{review.date}</div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 text-black dark:text-white">
                                                    {Array.from({ length: 5 }).map((_, j) => (
                                                        <Star key={j} className={cn("w-3.5 h-3.5", j < review.rating ? "fill-current" : "fill-gray-200 text-gray-200 dark:fill-neutral-800 dark:text-neutral-800")} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">"{review.comment}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* FAQs */}
                        {displaySite.faqs?.length > 0 && (
                            <div className="pt-16 border-t border-gray-100 dark:border-neutral-800">
                                <h3 className="text-3xl font-black text-black dark:text-white mb-8 tracking-tight">FAQ</h3>
                                <div className="grid gap-4">
                                    {displaySite.faqs.map((faq: any, i: number) => (
                                        <div key={i} className="border border-gray-100 dark:border-neutral-800 rounded-2xl p-8 bg-gray-50 dark:bg-neutral-900">
                                            <h4 className="font-bold text-lg text-black dark:text-white mb-3">{faq.question}</h4>
                                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{faq.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Schema.org Logic (Hidden) */}
                        <div className="hidden">
                            <script
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{
                                    __html: JSON.stringify({
                                        "@context": "https://schema.org",
                                        "@type": "FAQPage",
                                        "mainEntity": displaySite.faqs?.map((faq: any) => ({
                                            "@type": "Question",
                                            "name": faq.question,
                                            "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
                                        })) || []
                                    })
                                }}
                            />
                            {displaySite.seo?.structuredData && (
                                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: displaySite.seo.structuredData }} />
                            )}
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Sidebar (Sticky) - Hidden on Mobile */}
                    <div className="hidden lg:col-span-4 relative lg:block">
                        <div className="sticky top-28 space-y-8">

                            {/* Main CTA Card - Premium B&W + Amber Highlight */}
                            <div className="bg-white dark:bg-neutral-950 rounded-3xl p-6 border border-gray-200 dark:border-neutral-800 shadow-xl shadow-gray-200/50 dark:shadow-none relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-black dark:bg-white"></div>

                                <div className="w-24 h-24 mx-auto bg-gray-50 dark:bg-white rounded-2xl flex items-center justify-center p-4 mb-6 border border-gray-100 relative group-hover:scale-105 transition-transform duration-300">
                                    {displaySite.logoUrl ? (
                                        <img src={displaySite.logoUrl} alt={displaySite.name} className="max-w-full max-h-full object-contain" />
                                    ) : (
                                        <span className="text-3xl font-black text-gray-300">{displaySite.name[0]}</span>
                                    )}
                                </div>

                                <div className="text-center mb-8">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <h2 className="text-3xl font-black text-black dark:text-white tracking-tight">{displaySite.name}</h2>
                                        <div className="flex items-center gap-1 bg-black text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                                            <Star className="w-2.5 h-2.5 fill-current" />
                                            <span>{displaySite.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Premium Betting Partner</p>
                                </div>

                                {/* Offer Highlight - Amber */}
                                <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl mb-8 text-center border border-amber-100 dark:border-amber-900/20">
                                    <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-2">Exclusive Offer</p>
                                    <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500 leading-none tracking-tight">
                                        {displaySite.joiningBonus || "100% Bonus"}
                                    </p>
                                    {displaySite.reDepositBonus && (
                                        <p className="text-xs font-bold text-gray-500 mt-2">+ {displaySite.reDepositBonus} Reload</p>
                                    )}
                                </div>

                                <a href={displaySite.affiliateLink} target="_blank" rel="nofollow noreferrer" className="block w-full">
                                    <Button className="w-full h-14 text-sm font-black uppercase tracking-widest rounded-xl bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white shadow-xl hover:-translate-y-1 transition-all">
                                        Claim Bonus Now <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </a>
                                <p className="text-[10px] text-center text-gray-400 mt-4 font-bold uppercase tracking-widest">
                                    <ShieldCheck className="w-3 h-3 inline mr-1" /> Secure & Verified
                                </p>
                            </div>

                            {/* Info & Ratings */}
                            <div className="bg-gray-50 dark:bg-neutral-900 rounded-3xl p-8 border border-gray-100 dark:border-neutral-800">
                                <h3 className="font-black text-black dark:text-white mb-6 uppercase text-xs tracking-widest">At a Glance</h3>
                                <div className="space-y-6">
                                    {[
                                        { label: "Trust Score", value: displaySite.ratings?.trust, icon: ShieldCheck },
                                        { label: "Game Variety", value: displaySite.ratings?.games, icon: Globe },
                                        { label: "Bonuses", value: displaySite.ratings?.bonus, icon: Star },
                                        { label: "Support", value: displaySite.ratings?.support, icon: Building2 },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                                                <item.icon className="w-4 h-4" />
                                                {item.label}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-16 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: `${(item.value / 10) * 100}%` }}></div>
                                                </div>
                                                <span className="text-sm font-black text-black dark:text-white">{item.value}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

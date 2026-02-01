import { Metadata } from 'next';
import { notFound } from "next/navigation";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Game from "@/models/Game";
import connectToDatabase from "@/lib/db";
import { ArrowLeft, ExternalLink, Gamepad2, Star, ShieldCheck, Zap, HelpCircle, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { ContentWithAds } from "@/components/ads/ContentWithAds";

// Ensure models are registered for population
import "@/models/BettingSite";
import "@/models/Coupon";
import "@/models/News";
import "@/models/Blog";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

async function getGame(slug: string) {
    await connectToDatabase();
    const game = await Game.findOne({ slug, 'visibility.status': 'published' })
        .populate('relatedCasinos')
        .populate({
            path: 'relatedCoupons',
            match: { 'visibility.status': 'published' }
        })
        .populate('relatedNews')
        .populate('relatedBlogs')
        .lean();
    if (!game) return null;

    // Filter out null values from populated arrays (in case match didn't work)
    if (game.relatedCoupons) {
        game.relatedCoupons = game.relatedCoupons.filter((c: any) => c !== null);
    }

    // Debug logging
    console.log('Game coupons:', game.relatedCoupons?.length || 0, 'coupons found');
    if (game.relatedCoupons?.length > 0) {
        console.log('First coupon:', game.relatedCoupons[0]);
    }

    return JSON.parse(JSON.stringify(game));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const game = await getGame(slug);
    if (!game) return {};

    return {
        title: game.seo?.metaTitle || `${game.title} - Review & Play Online`,
        description: game.seo?.metaDescription || game.description,
        robots: {
            index: !game.seo?.noIndex,
            follow: !game.seo?.noIndex,
        }
    };
}

import { Promotion } from "@/models/Promotion";

// ... existing code ...

async function getPromotions(gameId: string) {
    await connectToDatabase();
    // Fetch one vertical and one horizontal ad relevant to this game
    // Priority: Specific targeting > Global
    // Implementation simplified for speed: Fetch all matching and filter in JS or just simple find

    // We want ads that are PUBLISHED and (Mode=All OR IncludedGames contains ID)
    const ads = await Promotion.find({
        'visibility.status': 'published',
        $or: [
            { 'displaySettings.mode': 'all' },
            { 'displaySettings.includedGames': gameId }
        ]
    }).lean();

    // Separate into Horizontal and Vertical
    const horizontal = ads.find(ad => ad.images?.horizontal);
    const vertical = ads.find(ad => ad.images?.vertical);

    return { horizontal: JSON.parse(JSON.stringify(horizontal || null)), vertical: JSON.parse(JSON.stringify(vertical || null)) };
}

export default async function GameDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const game = await getGame(slug);
    if (!game) notFound();

    const promotions = await getPromotions(game._id);

    // JSON-LD Schema
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Game",
        "name": game.title,
        "description": game.description,
        "image": game.coverImage,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": game.rating,
            "bestRating": "5",
            "worstRating": "0",
            "ratingCount": "100" // Mock count or real if available
        },
        "genre": game.category,
        "url": `${process.env.NEXT_PUBLIC_APP_URL}/games/${game.slug}`
    };

    const faqLd = game.faqs?.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": game.faqs.map((f: any) => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": f.answer
            }
        }))
    } : null;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {faqLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
                />
            )}

            {/* Header / Nav */}
            <div className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/games" className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-bold uppercase text-xs tracking-widest">Back to Games</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        {game.playLink && (
                            <Link href={game.playLink} target="_blank" rel="nofollow noreferrer">
                                <Button size="sm" className="bg-black text-white hover:bg-neutral-800 font-bold rounded-full shadow-lg">
                                    Play Now <ExternalLink className="w-3 h-3 ml-1" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200 py-12">
                <div className="container mx-auto px-4 max-w-[1400px]">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Game Cover */}
                        <div className="w-full md:w-1/3 aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
                            {game.coverImage ? (
                                <img src={game.coverImage} className="object-cover w-full h-full" alt={game.title} />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <Gamepad2 className="w-16 h-16 text-gray-300" />
                                </div>
                            )}
                        </div>

                        {/* Game Info */}
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                                <Badge variant="outline" className="border-gray-300 text-gray-700">{game.category}</Badge>
                                <span>•</span>
                                <span className="uppercase">{game.provider || "Standard Provider"}</span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 leading-none">
                                {game.title}
                            </h1>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center text-yellow-500">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className={`w-5 h-5 ${s <= Math.round(game.rating) ? "fill-current" : "text-gray-300"}`} />
                                    ))}
                                </div>
                                <span className="text-gray-600 font-bold ml-2">{(game.rating || 0).toFixed(1)}/5 Rating</span>
                            </div>

                            <div className="flex gap-3 pt-4">
                                {game.playLink && (
                                    <Link href={game.playLink} target="_blank" rel="nofollow noreferrer">
                                        <Button size="lg" className="bg-black hover:bg-neutral-800 text-white font-bold h-12 px-8 text-lg shadow-xl">
                                            Play Now <ExternalLink className="ml-2 w-4 h-4" />
                                        </Button>
                                    </Link>
                                )}
                                {game.demoLink && (
                                    <Link href={game.demoLink} target="_blank" rel="nofollow noreferrer">
                                        <Button size="lg" variant="outline" className="border-gray-300 hover:bg-gray-50 font-bold h-12 text-gray-900">
                                            Try Demo
                                        </Button>
                                    </Link>
                                )}
                            </div>

                            <p className="text-gray-600 leading-relaxed max-w-2xl">{game.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-[1400px] py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Article */}
                    <div className="lg:w-2/3 space-y-12">
                        {/* Pros & Cons */}
                        {(game.pros?.length > 0 || game.cons?.length > 0) && (
                            <div className="grid md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                                {game.pros?.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold mb-4 text-green-600 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Pros</h3>
                                        <ul className="space-y-2">
                                            {game.pros.map((pro: string, i: number) => (
                                                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                                    {pro}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {game.cons?.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold mb-4 text-red-500 flex items-center gap-2"><XCircle className="w-5 h-5" /> Cons</h3>
                                        <ul className="space-y-2">
                                            {game.cons.map((con: string, i: number) => (
                                                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                                    {con}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="prose prose-base max-w-none 
                            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900
                            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
                            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                            prose-p:text-gray-700 prose-p:leading-relaxed
                            prose-a:text-blue-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-gray-900
                            prose-ul:marker:text-gray-400 prose-li:text-gray-700
                            prose-img:rounded-xl prose-img:shadow-lg prose-img:border prose-img:border-gray-200 prose-img:my-8 prose-img:w-full
                        ">
                            <ContentWithAds
                                content={game.content}
                                ads={promotions.horizontal ? [promotions.horizontal] : []}
                            />
                        </div>

                        {/* Screenshots Gallery */}
                        {game.screenshots?.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-3xl font-black mb-6 flex items-center gap-2">In-Game Screenshots</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {game.screenshots.map((shot: string, i: number) => (
                                        <div key={i} className="aspect-video relative rounded-xl overflow-hidden border border-gray-800 bg-neutral-900 group">
                                            <img src={shot} alt={`${game.title} Screenshot ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* FAQs */}
                        {game.faqs?.length > 0 && (
                            <div className="pt-8 border-t border-gray-200">
                                <h2 className="text-3xl font-black mb-6 flex items-center gap-2 text-gray-900"><HelpCircle className="w-6 h-6" /> Frequently Asked Questions</h2>
                                <Accordion type="single" collapsible className="w-full">
                                    {game.faqs.map((faq: any, i: number) => (
                                        <AccordionItem key={i} value={`item-${i}`} className="border-gray-200">
                                            <AccordionTrigger className="text-lg font-bold hover:no-underline hover:text-primary text-gray-800">{faq.question}</AccordionTrigger>
                                            <AccordionContent className="text-gray-600 text-base leading-relaxed">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-1/3 space-y-8">
                        {/* Related Coupons */}
                        {game.relatedCoupons?.length > 0 && (
                            <div className="bg-white rounded-xl p-6 border border-gray-200 border-l-4 border-l-yellow-500 shadow-sm">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900"><Trophy className="w-4 h-4 text-yellow-500" /> Exclusive Offers</h3>
                                <div className="space-y-3">
                                    {game.relatedCoupons.map((coupon: any) => (
                                        <div key={coupon._id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-yellow-500/50 transition-colors">
                                            <div className="font-bold text-sm text-gray-900 mb-1">{coupon.name}</div>
                                            <div className="text-xs text-green-600 font-bold mb-2">{coupon.offer}</div>
                                            <Link href={coupon.redirectLink} target="_blank" rel="nofollow">
                                                <Button size="sm" className="w-full h-8 text-xs font-bold bg-yellow-500 text-black hover:bg-yellow-400">
                                                    GET BONUS
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Related Casinos */}
                        {game.relatedCasinos?.length > 0 && (
                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-bold mb-4 text-gray-900">Recommended Casinos</h3>
                                <div className="space-y-4">
                                    {game.relatedCasinos.map((casino: any) => (
                                        <div key={casino._id} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0 p-2">
                                                {casino.logoUrl ? (
                                                    <img src={casino.logoUrl} className="w-full h-full object-contain" alt={casino.name} />
                                                ) : (
                                                    <div className="text-xs font-bold text-gray-300">LOGO</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-base text-gray-900 truncate">{casino.name}</div>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                                    <span className="text-xs font-bold text-gray-600">{casino.rating}/5</span>
                                                </div>
                                            </div>
                                            <Link href={`/${casino.slug}`}>
                                                <Button size="sm" className="h-9 px-4 text-xs font-bold bg-black text-white hover:bg-neutral-800 rounded-lg">
                                                    Review
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}



                        {/* Related News */}
                        {game.relatedNews?.length > 0 && (
                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-bold mb-4 text-gray-900">Latest News</h3>
                                <div className="space-y-4">
                                    {game.relatedNews.map((news: any) => (
                                        <Link key={news._id} href={`/news/${news.slug}`} className="block group">
                                            <div className="flex gap-3">
                                                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
                                                    {news.coverImageUrl ? (
                                                        <img src={news.coverImageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={news.title} />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                            <div className="text-[10px] text-gray-400 font-bold">IMG</div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold leading-tight text-gray-900 group-hover:text-primary transition-colors line-clamp-2">{news.title}</h4>
                                                    <p className="text-xs text-gray-500 mt-1">{new Date(news.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Related Blogs */}
                        {game.relatedBlogs?.length > 0 && (
                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-bold mb-4 text-gray-900">Strategy Guides</h3>
                                <ul className="space-y-3">
                                    {game.relatedBlogs.map((blog: any) => (
                                        <li key={blog._id}>
                                            <Link href={`/blogs/${blog.slug}`} className="block group">
                                                <div className="flex gap-3">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
                                                        {blog.coverImageUrl ? (
                                                            <img src={blog.coverImageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={blog.title} />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                                <div className="text-[10px] text-gray-400 font-bold">IMG</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold leading-tight text-gray-600 group-hover:text-black transition-colors line-clamp-2">{blog.title}</h4>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Sidebar Ad (Vertical) */}
                        {promotions.vertical && (
                            <div className="hidden lg:block sticky top-24">
                                <div className="max-w-[240px] mx-auto">
                                    <a href={promotions.vertical.redirectUrl} target="_blank" rel="nofollow noreferrer" className="block relative group">
                                        <img src={promotions.vertical.images.vertical} alt={promotions.vertical.title} className="w-full h-auto rounded-lg" />
                                        <div className="mt-2 text-center">
                                            <span className="inline-flex items-center justify-center px-4 py-1.5 bg-black text-white text-xs font-bold rounded-full shadow-sm group-hover:bg-primary transition-colors">
                                                {promotions.vertical.ctaText || "Visit Now"} <ExternalLink className="w-3 h-3 ml-1.5" />
                                            </span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
}

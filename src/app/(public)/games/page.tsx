import Link from "next/link";
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Gamepad2, Trophy, Dice5, Target, Flame, ArrowRight, Club, MonitorPlay, Star } from 'lucide-react';
import { BettingSite } from "@/models/BettingSite";
import Game from "@/models/Game";
import GameCategory from "@/models/GameCategory";
import connectToDatabase from "@/lib/db";

export const metadata: Metadata = {
    title: "Play Real Money Games | Cricket, Casino & IPL Betting",
    description: "Explore the best online casino games, betting games (Aviator, Crash), and major sports events like IPL and World Cup. Play and win big today!",
};

const CATEGORIES_LIST = [
    { name: "All Games", slug: "all", icon: Gamepad2 },
    { name: "Casino", slug: "casino", icon: Dice5 },
    { name: "Crash Games", slug: "crash-games", icon: Flame },
    { name: "Sports Betting", slug: "sports-betting", icon: Trophy },
    { name: "Slots", slug: "slots", icon: Target },
    { name: "Card Games", slug: "card-games", icon: Club },
    { name: "Table Games", slug: "table-games", icon: MonitorPlay },
    { name: "Fantasy Sports", slug: "fantasy-sports", icon: Star },
    { name: "Lottery", slug: "lottery", icon: Star },
    { name: "Other", slug: "other", icon: Gamepad2 }
];

async function getData(categorySlug?: string) {
    await connectToDatabase();

    const query: any = { 'visibility.status': 'published' };

    // Filter by Category if provided and not 'all'
    if (categorySlug && categorySlug !== 'all') {
        // We need to match the slug back to the Name stored in DB (e.g. "Crash Games")
        // Or we can store slug in DB. Currently DB stores Name "Crash Games".
        // Let's try to match loosely or use the predefined mapping.
        const categoryName = CATEGORIES_LIST.find(c => c.slug === categorySlug)?.name;
        if (categoryName) {
            query.category = categoryName;
        }
    }

    // Fetch published games
    const games = await Game.find(query)
        .sort({ 'visibility.displayOrder': 1, createdAt: -1 })
        .lean();

    // Fetch Featured Operators for Games Page
    const featuredOperators = await BettingSite.find({
        'visibility.status': 'published',
        showOnGamesPage: true
    })
        .select('name slug logoUrl rating ctaText affiliateLink')
        .sort({ 'visibility.displayOrder': 1, rating: -1 })
        .limit(6)
        .lean();

    return {
        games: JSON.parse(JSON.stringify(games)),
        featuredOperators: JSON.parse(JSON.stringify(featuredOperators)),
        categories: CATEGORIES_LIST // Return hardcoded list for Filter UI
    };
}

export default async function GamesPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
    // Await params for Next.js 15
    const { category } = await searchParams;
    const { games, categories, featuredOperators } = await getData(category);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
            {/* Hero Section */}
            <div className="relative py-16 flex items-center justify-center overflow-hidden border-b border-gray-200 bg-white">
                <div className="absolute inset-0 bg-gray-50 opacity-50" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tighter text-gray-900 uppercase">
                        {category && category !== 'all' ? category.replace('-', ' ') : 'Real Money Games'}
                    </h1>
                    <p className="text-base text-gray-600 max-w-2xl mx-auto font-medium">
                        Play the best online games. Win real money.
                    </p>
                </div>
            </div>

            {/* Featured Operators for Games */}
            {featuredOperators.length > 0 && (
                <div className="container mx-auto px-4 py-8 border-b border-gray-200">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Recommended for You</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {featuredOperators.map((site: any) => (
                            <Link key={site._id} href={`/sites/${site.slug}`} className="block group bg-white border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors hover:shadow-md text-center">
                                <div className="h-10 w-auto mx-auto mb-3 flex items-center justify-center">
                                    <img src={site.logoUrl} alt={site.name} className="max-h-full max-w-full object-contain" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center gap-1 text-yellow-500">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span className="text-xs font-bold text-gray-900">{site.rating}/10</span>
                                    </div>
                                    <a href={site.affiliateLink} target="_blank" rel="nofollow noreferrer" className="block" onClick={(e) => e.stopPropagation()}>
                                        <Button size="sm" className="w-full h-8 text-xs font-bold rounded-md bg-black text-white hover:bg-neutral-800">
                                            {site.ctaText || "Play Now"}
                                        </Button>
                                    </a>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Filter Bar */}
            <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 py-3 overflow-x-auto">
                <div className="container mx-auto px-4 flex gap-2 min-w-max">
                    {categories.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={cat.slug === 'all' ? '/games' : `/games?category=${cat.slug}`}
                        >
                            <Button
                                size="sm"
                                variant={category === cat.slug || (!category && cat.slug === 'all') ? "default" : "outline"}
                                className={`rounded-full border-gray-300 font-bold text-xs h-8 ${category === cat.slug || (!category && cat.slug === 'all') ? "bg-black text-white hover:bg-neutral-800" : "bg-transparent text-gray-600 hover:text-black hover:bg-gray-100"}`}
                            >
                                {cat.icon && <cat.icon className="w-3 h-3 mr-2" />}
                                {cat.name}
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Latest Games Reviews */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-xl font-black mb-6 border-l-4 border-black pl-3 text-gray-900">Game Reviews & Guides</h2>

                {games.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {games.map((game: any) => (
                            <Link key={game._id} href={`/games/${game.slug}`} className="group block bg-white border border-gray-200 hover:border-black transition-colors rounded-lg overflow-hidden shadow-sm hover:shadow-md">
                                <div className="aspect-video relative overflow-hidden bg-gray-100">
                                    <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-2 right-2 bg-white/90 text-black text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wide rounded-sm shadow-sm backdrop-blur-sm">
                                        {game.category}
                                    </div>
                                </div>
                                <div className="p-3">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-2.5 h-2.5 ${i < Math.round(game.rating) ? "fill-current" : "text-gray-300"}`} />
                                            ))}
                                        </div>
                                        <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">{game.provider}</span>
                                    </div>
                                    <h3 className="text-sm font-bold mb-1.5 text-gray-900 group-hover:text-primary line-clamp-1">{game.title}</h3>
                                    <p className="text-[10px] text-gray-500 line-clamp-2 mb-2 leading-relaxed">
                                        {game.description}
                                    </p>
                                    <div className="flex items-center text-[9px] font-bold uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-0.5 group-hover:border-black transition-colors w-max">
                                        Read Review <ArrowRight className="w-2.5 h-2.5 ml-1" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-gray-300 rounded-lg">
                        <p className="text-gray-500">No game reviews published yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

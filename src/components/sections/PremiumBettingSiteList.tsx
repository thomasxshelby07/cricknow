import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle, ExternalLink, ShieldCheck, Trophy, ArrowRight } from "lucide-react";
import connectToDatabase from "@/lib/db";
import { BettingSite } from "@/models/BettingSite";
import { cn } from "@/lib/utils";

interface BettingSiteListProps {
    count?: number;
    filter?: string; // 'all', 'featured', 'new'
    manualIds?: string[]; // IDs from Admin Config
    showEmptyState?: boolean;
}

async function getSites(count: number, filter: string, manualIds?: string[]) {
    await connectToDatabase();

    // If manual IDs provided (Admin Control), fetch specific sites
    if (manualIds && manualIds.length > 0) {
        const sites = await BettingSite.find({
            _id: { $in: manualIds },
            'visibility.status': 'published',
            'visibility.showOnHome': true
        }).lean();

        // Sort by the order in manualIds
        return manualIds
            .map(id => sites.find((s: any) => s._id.toString() === id))
            .filter(s => s !== undefined)
            .slice(0, count);
    }

    // Default Fallback Logic
    let query: any = {
        'visibility.status': 'published',
        'visibility.showOnHome': true
    };
    if (filter === 'featured') query.isFeatured = true;

    return await BettingSite.find(query)
        .sort({ 'visibility.displayOrder': 1, rating: -1 })
        .limit(count)
        .lean();
}

export async function PremiumBettingSiteList({ count = 10, filter = 'all', manualIds, showEmptyState = true }: BettingSiteListProps) {
    const sites = await getSites(Number(count), filter, manualIds);

    // DUMMY STATE
    if ((!sites || sites.length === 0) && showEmptyState) {
        return (
            <section className="py-12 bg-white dark:bg-black">
                <div className="container mx-auto px-4">
                    <div className="relative bg-gray-50 dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-8 flex flex-col items-center justify-center text-center opacity-80 select-none">
                        <Trophy className="w-12 h-12 text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-400 mb-2">Top Betting Sites Coming Soon</h3>
                        <p className="text-sm text-gray-400">We are curating the best betting sites for you.</p>
                    </div>
                </div>
            </section>
        );
    }

    if (!sites || sites.length === 0) return null;

    return (
        <section className="py-8 bg-white dark:bg-black">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col gap-4">
                    {sites.map((site: any, index: number) => {
                        return (
                            <div
                                key={site._id}
                                className="relative bg-white dark:bg-neutral-950 rounded-xl border border-gray-200 dark:border-neutral-800 p-4 md:p-5 flex flex-col md:flex-row items-center gap-4 md:gap-8 hover:border-black dark:hover:border-white transition-colors duration-300 group shadow-sm hover:shadow-lg"
                            >
                                {/* Rank Badge - Minimal Black Tag */}
                                <div className="absolute top-0 left-0 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-br-lg rounded-tl-lg z-10 font-mono tracking-wider">
                                    #{index + 1}
                                </div>

                                {/* 1. Logo Section */}
                                <div className="flex-shrink-0 w-16 h-16 md:w-24 md:h-24 p-2 bg-gray-50 dark:bg-white rounded-lg flex items-center justify-center border border-gray-100 relative group-hover:scale-105 transition-transform duration-300">
                                    {site.logoUrl ? (
                                        <img src={site.logoUrl} alt={site.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-2xl font-black text-gray-300">{site.name[0]}</span>
                                    )}
                                </div>

                                {/* 2. Info & Features */}
                                <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <h3 className="text-xl md:text-2xl font-black text-black dark:text-white capitalize tracking-tight">
                                            {site.name}
                                        </h3>
                                        <div className="flex items-center gap-1 bg-black text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                                            <Star className="w-2.5 h-2.5 fill-current" />
                                            <span>{site.rating}</span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-500 font-medium mb-3 line-clamp-1">
                                        {site.shortDescription || "Best betting site in India with fast withdrawals."}
                                    </p>

                                    {/* Badges - Clean Gray Pills */}
                                    {site.badges && site.badges.length > 0 && (
                                        <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
                                            {site.badges.slice(0, 3).map((badge: string) => (
                                                <div key={badge} className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 px-2 py-0.5 rounded font-bold">
                                                    <CheckCircle className="w-2.5 h-2.5" />
                                                    {badge}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* 3. The OFFER (Centerpiece) - Highlighted */}
                                <div className="flex flex-col items-center justify-center w-full md:w-auto min-w-[180px] border-y md:border-y-0 md:border-x border-gray-100 dark:border-neutral-900 py-3 md:py-0 md:px-6 bg-amber-50 dark:bg-amber-900/10 md:bg-transparent md:dark:bg-transparent rounded-lg md:rounded-none my-3 md:my-0">
                                    <div className="text-[9px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-0.5 text-center">Exclusive Welcome Offer</div>
                                    <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500 text-center leading-none tracking-tight">
                                        {site.joiningBonus || "100% Bonus"}
                                    </div>
                                    {(site.reDepositBonus) && (
                                        <div className="text-[10px] font-bold text-gray-500 mt-1 text-center bg-white dark:bg-neutral-800 px-1.5 py-0.5 rounded shadow-sm border border-gray-100 dark:border-neutral-700 inline-block">
                                            + {site.reDepositBonus} Reload
                                        </div>
                                    )}
                                </div>

                                {/* 4. Actions */}
                                <div className="flex flex-col gap-2 w-full md:w-[160px] flex-shrink-0">
                                    <a
                                        href={site.affiliateLink || "#"}
                                        target="_blank"
                                        rel="nofollow noreferrer"
                                        className="w-full"
                                    >
                                        <Button className="w-full bg-gradient-to-r from-neutral-900 to-black hover:from-black hover:to-neutral-900 dark:from-white dark:to-gray-200 dark:text-black text-white font-black h-10 rounded-lg text-xs uppercase tracking-wide shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 border border-transparent hover:border-amber-500/50">
                                            Claim Bonus <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                                        </Button>
                                    </a>
                                    <Link href={`/${site.slug}`} className="w-full">
                                        <Button variant="outline" className="w-full h-8 text-[10px] font-bold border-gray-300 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900 text-gray-600 dark:text-gray-400 rounded-lg">
                                            Read Review
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
}

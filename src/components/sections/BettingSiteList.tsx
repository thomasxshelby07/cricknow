import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle, ExternalLink, ShieldCheck, Trophy, Info } from "lucide-react";
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

export async function BettingSiteList({ count = 10, filter = 'all', manualIds, showEmptyState = true }: BettingSiteListProps) {
    const sites = await getSites(Number(count), filter, manualIds);

    // DUMMY STATE
    if ((!sites || sites.length === 0) && showEmptyState) {
        return (
            <section className="py-12 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col md:flex-row items-center gap-6 opacity-80 select-none">
                        <div className="absolute top-0 left-0 bg-gray-200 dark:bg-gray-700 text-gray-400 text-xs font-bold px-3 py-1 rounded-br-lg rounded-tl-lg">
                            #1
                        </div>
                        <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Trophy className="w-10 h-10 text-gray-300" />
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h3 className="text-xl font-bold text-gray-400">Top Betting Sites Coming Soon</h3>
                            <p className="text-sm text-gray-400 max-w-lg">We are curating the best betting sites for you.</p>
                        </div>
                        <div className="min-w-[200px] flex flex-col items-center gap-3 md:border-l md:pl-6 border-gray-100">
                            <Button disabled className="w-full bg-gray-200 text-gray-400 cursor-not-allowed">Coming Soon</Button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!sites || sites.length === 0) return null;

    return (
        <section className="py-8 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="flex flex-col gap-3 md:gap-4">
                    {sites.map((site: any, index: number) => {
                        const isTop3 = index < 3;
                        const RankBadgeColor = isTop3
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-500";

                        return (
                            <div
                                key={site._id}
                                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 hover:shadow-lg transition-all duration-300 group"
                            >
                                {/* Rank Badge */}
                                <div className={cn(
                                    "absolute top-0 left-0 text-xs sm:text-sm font-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-br-2xl rounded-tl-2xl z-10 shadow-sm font-mono tracking-tighter",
                                    RankBadgeColor
                                )}>
                                    #{index + 1}
                                </div>

                                <div className="w-full flex flex-row items-center gap-4 md:gap-8">
                                    {/* Logo (Left) - Larger & Uncropped */}
                                    <div className="flex-shrink-0 w-20 h-20 md:w-32 md:h-32 bg-white dark:bg-gray-700 rounded-xl md:rounded-2xl border-2 border-gray-50 dark:border-gray-600 flex items-center justify-center p-2 relative overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-300">
                                        {site.logoUrl ? (
                                            <img src={site.logoUrl} alt={site.name} className="w-full h-full object-contain p-1" />
                                        ) : (
                                            <span className="text-3xl font-black text-gray-200">{site.name[0]}</span>
                                        )}
                                    </div>

                                    {/* Details (Middle) */}
                                    <div className="flex-1 flex flex-col justify-center min-w-0 py-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg md:text-2xl font-black text-gray-900 dark:text-white capitalize truncate tracking-tight">
                                                {site.name}
                                            </h3>
                                            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full border border-yellow-100 dark:border-yellow-800">
                                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                                <span className="text-xs md:text-sm font-bold text-yellow-700 dark:text-yellow-400">{site.rating}</span>
                                            </div>
                                        </div>

                                        <p className="text-xs md:text-sm text-gray-500 font-medium line-clamp-2 md:line-clamp-1 mb-3">
                                            {site.shortDescription || "Best betting site in India with fast withdrawals."}
                                        </p>

                                        {/* Badges - Desktop */}
                                        {site.badges && site.badges.length > 0 && (
                                            <div className="hidden md:flex flex-wrap gap-2">
                                                {site.badges.slice(0, 4).map((badge: string) => (
                                                    <div key={badge} className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 px-2 py-1 rounded-md font-bold">
                                                        <CheckCircle className="w-3 h-3" />
                                                        {badge}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Highlighted Bonus (Desktop) */}
                                    <div className="hidden md:flex flex-col items-center justify-center w-[280px] px-6 py-4 bg-orange-50/50 dark:bg-gray-700/50 rounded-xl border-2 border-dashed border-orange-200 dark:border-gray-600 relative overflow-hidden group-hover:bg-orange-50 transition-colors duration-300">
                                        <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1.5">Exclusive Offer</div>
                                        <div className="text-2xl font-black text-gray-900 dark:text-white text-center leading-none mb-3">
                                            {site.joiningBonus || "100% Welcome Bonus"}
                                        </div>
                                        <div className="w-full h-px bg-orange-100 dark:bg-gray-600 mb-2"></div>
                                        {(site.reDepositBonus || site.otherBonus) && (
                                            <div className="w-full flex flex-col gap-1.5">
                                                {site.reDepositBonus && (
                                                    <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                                                        <span>Reload:</span> <span className="text-gray-800 dark:text-gray-200">{site.reDepositBonus}</span>
                                                    </div>
                                                )}
                                                {site.otherBonus && (
                                                    <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                                                        <span>Extra:</span> <span className="text-gray-800 dark:text-gray-200">{site.otherBonus}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions (Desktop) */}
                                    <div className="hidden md:flex flex-col items-center gap-3 w-[160px]">
                                        <a
                                            href={site.affiliateLink || "#"}
                                            target="_blank"
                                            rel="nofollow noreferrer"
                                            className="w-full"
                                        >
                                            <Button className="w-full bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white font-bold h-11 text-sm rounded-xl shadow-xl shadow-black/5 hover:scale-105 transition-transform">
                                                Claim Bonus <ExternalLink className="ml-2 h-3.5 w-3.5" />
                                            </Button>
                                        </a>
                                        <Link href={`/${site.slug}`} className="w-full">
                                            <Button variant="ghost" className="w-full h-9 text-xs font-semibold text-gray-500 hover:text-black hover:bg-transparent underline decoration-gray-300 hover:decoration-black underline-offset-4">
                                                Read Review
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Mobile Only: Badges & Bonus & Actions Stacked */}
                                <div className="flex md:hidden flex-col w-full gap-3 mt-1">
                                    {/* Mobile Badges Scroll */}
                                    {site.badges && site.badges.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {site.badges.slice(0, 3).map((badge: string) => (
                                                <div key={badge} className="flex items-center gap-1 text-[9px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                                                    <CheckCircle className="w-2.5 h-2.5" /> {badge}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Mobile Bonus Box */}
                                    <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 flex flex-col gap-2 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wide">Welcome Offer</span>
                                                <span className="text-base font-black text-gray-900">{site.joiningBonus || "100% Bonus"}</span>
                                            </div>
                                            {site.ctaText && (
                                                <div className="text-[10px] font-bold text-white bg-orange-500 px-2 py-1 rounded shadow-sm shadow-orange-200">
                                                    {site.ctaText}
                                                </div>
                                            )}
                                        </div>

                                        {/* Mobile Extra Bonuses */}
                                        {(site.reDepositBonus || site.otherBonus) && (
                                            <div className="pt-2 border-t border-orange-200/50 flex flex-col gap-1">
                                                {site.reDepositBonus && (
                                                    <div className="flex justify-between items-center text-[10px] text-gray-600">
                                                        <span className="font-medium">Reload Bonus:</span> <span className="font-bold text-gray-900">{site.reDepositBonus}</span>
                                                    </div>
                                                )}
                                                {site.otherBonus && (
                                                    <div className="flex justify-between items-center text-[10px] text-gray-600">
                                                        <span className="font-medium">Extra Offer:</span> <span className="font-bold text-gray-900">{site.otherBonus}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Mobile Buttons */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link href={`/${site.slug}`} className="w-full">
                                            <Button variant="outline" className="w-full h-10 font-bold border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl">
                                                Review
                                            </Button>
                                        </Link>
                                        <a
                                            href={site.affiliateLink || "#"}
                                            target="_blank"
                                            rel="nofollow noreferrer"
                                            className="w-full"
                                        >
                                            <Button className="w-full h-10 bg-black text-white font-bold rounded-xl shadow-lg shadow-black/10">
                                                Claim Bonus
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
}

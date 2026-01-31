import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, ShieldCheck, CheckCircle, Info, Trophy, Gift, Zap } from "lucide-react";
import connectToDatabase from "@/lib/db";
import { BettingSite } from "@/models/BettingSite";
import { cn } from "@/lib/utils";

async function getAllSites() {
    await connectToDatabase();
    return await BettingSite.find({ 'visibility.status': 'published' })
        .sort({ 'visibility.displayOrder': 1, rating: -1 })
        .lean();
}

export async function AllBettingSitesGrid() {
    const sites = await getAllSites();

    if (!sites || sites.length === 0) {
        return <div className="text-center py-20 text-gray-500">No betting sites found.</div>;
    }

    return (
        <section className="py-8 md:py-12 bg-white dark:bg-neutral-950 min-h-[60vh]">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {sites.map((site: any, index: number) => {
                        // Scale rating to 10 if it's <= 5
                        const ratingOutOf10 = site.rating <= 5 ? (site.rating * 2) : site.rating;

                        return (
                            <div
                                key={site._id}
                                className="group relative flex flex-row bg-white dark:bg-neutral-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 min-h-[160px]"
                            >
                                {/* Left Section: Logo & Rank (Fixed Width) */}
                                <div className="w-[100px] sm:w-[140px] md:w-1/3 bg-gray-50 dark:bg-neutral-800/50 flex flex-col items-center justify-center p-2 sm:p-6 border-r border-gray-100 dark:border-gray-800 group-hover:bg-gray-100 dark:group-hover:bg-neutral-800 transition-colors relative">
                                    {/* Rank Badge */}
                                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white dark:bg-neutral-800 border border-gray-100 dark:border-gray-700 shadow-sm px-1.5 py-0.5 rounded-md flex items-center gap-1 z-10">
                                        <span className="text-[10px] sm:text-xs font-black text-neutral-900 dark:text-white">#{index + 1}</span>
                                    </div>

                                    <div className="w-16 h-16 sm:w-20 sm:h-20 mb-1 sm:mb-3 flex items-center justify-center mt-4 sm:mt-0">
                                        {site.logoUrl ? (
                                            <img src={site.logoUrl} alt={site.name} className="max-w-full max-h-full object-contain drop-shadow-sm transition-transform group-hover:scale-110 duration-500" />
                                        ) : (
                                            <span className="text-2xl sm:text-3xl font-black text-gray-200 tracking-tighter uppercase">{site.name[0]}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full border border-yellow-100 dark:border-yellow-900/50">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">{ratingOutOf10}/10</span>
                                    </div>
                                </div>

                                {/* Right Section: Content & Actions */}
                                <div className="flex-1 p-3 sm:p-5 flex flex-col justify-between">
                                    <div className="flex flex-col gap-2">
                                        {/* Name Row */}
                                        <h3 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white leading-tight line-clamp-1">
                                            {site.name}
                                        </h3>

                                        {/* Badges Row - Now distinct below name */}
                                        <div className="flex flex-wrap gap-1.5 min-h-[22px]">
                                            {site.badges?.slice(0, 5).map((badge: string) => (
                                                <span key={badge} className="bg-gray-50 text-gray-600 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded border border-gray-200 uppercase tracking-tight whitespace-nowrap">
                                                    {badge}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Bonus - Highly Visible Area */}
                                        <div className="flex items-center gap-3 p-2.5 bg-gradient-to-r from-orange-50 to-orange-50/50 dark:from-neutral-800 dark:to-neutral-800/50 border border-orange-100 dark:border-neutral-700 dashed rounded-xl mt-1">
                                            <div className="shrink-0 p-1.5 bg-white dark:bg-neutral-700 rounded-lg shadow-sm text-orange-500">
                                                <Zap className="w-5 h-5 fill-current" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest line-clamp-1">Welcome Bonus</p>
                                                <p className="text-sm sm:text-lg font-black text-neutral-900 dark:text-white leading-none mt-0.5">
                                                    {site.joiningBonus || "100% Match Bonus"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions Row */}
                                    <div className="flex items-center gap-2 mt-3">
                                        <a
                                            href={site.affiliateLink || "#"}
                                            target="_blank"
                                            rel="nofollow noreferrer"
                                            className="flex-1"
                                        >
                                            <Button className="w-full h-10 sm:h-11 bg-neutral-900 hover:bg-black text-white rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm shadow-md transition-transform active:scale-95 group-hover:bg-neutral-800">
                                                Visit Site <ExternalLink className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 opacity-70" />
                                            </Button>
                                        </a>
                                        <Link href={`/${site.slug}`}>
                                            <Button variant="outline" className="h-10 w-10 sm:h-11 sm:w-11 p-0 rounded-lg sm:rounded-xl border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-black hover:border-black transition-colors">
                                                <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gift } from "lucide-react";
import connectToDatabase from "@/lib/db";
import { Promotion } from "@/models/Promotion";

interface PromotionGridProps {
    count?: number;
    filter?: string; // 'all'
    title?: string;
}

async function getPromotions(count: number) {
    await connectToDatabase();
    return await Promotion.find({ 'visibility.status': 'published' })
        .sort({ 'visibility.displayOrder': 1, createdAt: -1 })
        .limit(count)
        .populate('siteId', 'name logoUrl slug') // Get linked site details
        .lean();
}

export async function PromotionGrid({ count = 6, title = "Latest Exclusive Offers", showLink = true, showEmptyState = false }: PromotionGridProps & { showLink?: boolean; showEmptyState?: boolean }) {
    const promotions = await getPromotions(Number(count));

    if ((!promotions || promotions.length === 0) && !showEmptyState) return null;

    if (!promotions || promotions.length === 0) {
        return (
            <section className="py-12 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4 text-center text-gray-500">
                    <p>No offers found.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-neutral-dark dark:text-white flex items-center gap-2">
                        <Gift className="text-primary h-6 w-6" /> {title}
                    </h2>
                    {showLink && (
                        <Link href="/offers" className="text-primary text-sm font-medium hover:underline flex items-center">
                            View All <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {promotions.map((promo: any) => (
                        <div key={promo._id} className="group relative border rounded-xl overflow-hidden hover:shadow-lg transition-all dark:border-gray-800 bg-white dark:bg-gray-900">
                            {/* Badge */}
                            <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                                {promo.type || "Exclusive"}
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    {promo.siteId?.logoUrl ? (
                                        <img src={promo.siteId.logoUrl} alt={promo.siteId.name} className="w-10 h-10 object-contain" />
                                    ) : (
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-400">
                                            {promo.siteId?.name?.[0] || "?"}
                                        </div>
                                    )}
                                    <span className="text-sm text-gray-500">{promo.siteId?.name || "Partner Site"}</span>
                                </div>

                                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[56px]">
                                    {promo.title}
                                </h3>

                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center mb-4">
                                    <p className="text-sm text-gray-500">Bonus Code</p>
                                    <p className="font-mono font-bold text-neutral-dark dark:text-white border-dashed border-b border-gray-300 inline-block">
                                        {promo.promoCode || "NO CODE NEEDED"}
                                    </p>
                                </div>

                                <a href={promo.trackingLink || "#"} target="_blank" rel="nofollow noreferrer">
                                    <Button className="w-full bg-neutral-dark hover:bg-primary text-white transition-colors">
                                        Claim Offer
                                    </Button>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

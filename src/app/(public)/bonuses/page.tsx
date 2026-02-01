import { Metadata } from "next";
import connectToDatabase from "@/lib/db";
import { Coupon } from "@/models/Coupon";
import { Gift, TrendingUp, Percent, Sparkles } from "lucide-react";
import { CouponBanner } from "@/components/public/CouponBanner";

export const metadata: Metadata = {
    title: "Bonuses & Coupons - Exclusive Betting Offers | CricKnow",
    description: "Discover the best bonuses and coupons for online betting sites in India. Get exclusive welcome offers, deposit bonuses, and promotional codes.",
};

async function getCoupons() {
    await connectToDatabase();
    const coupons = await Coupon.find({
        'visibility.status': 'published',
        showOnBonuses: true
    })
        .sort({ 'visibility.displayOrder': 1, createdAt: -1 })
        .limit(50)
        .lean();
    return JSON.parse(JSON.stringify(coupons));
}

export default async function BonusesPage() {
    const coupons = await getCoupons();

    return (
        <div className="bg-white dark:bg-black min-h-screen">
            {/* Header Section */}
            <div className="bg-black text-white pt-24 pb-16 border-b border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-xs font-bold rounded-full uppercase tracking-widest mb-6 border border-white/10">
                            <Gift className="w-4 h-4" /> Exclusive Offers
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                            Bonuses & Coupons
                        </h1>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
                            Get the best bonuses and promotional codes for top betting sites in India. Exclusive welcome offers, deposit bonuses, and more.
                        </p>
                    </div>
                </div>
            </div>

            {/* Coupons Section */}
            <div className="container mx-auto px-4 py-16">
                {coupons.length === 0 ? (
                    <div className="text-center py-20">
                        <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
                        <h3 className="text-xl font-bold text-gray-400 dark:text-gray-600 mb-2">No Bonuses Available</h3>
                        <p className="text-gray-500 dark:text-gray-500">Check back soon for exclusive offers!</p>
                    </div>
                ) : (
                    <div className="space-y-6 max-w-5xl mx-auto">
                        {coupons.map((coupon: any) => (
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
                )}
            </div>
        </div>
    );
}

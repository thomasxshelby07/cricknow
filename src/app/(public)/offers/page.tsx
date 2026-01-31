import { PromotionGrid } from "@/components/sections/PromotionGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Exclusive Cricket Betting Offers & Bonuses | Cricknow",
    description: "Claim the best cricket betting offers, sign-up bonuses, and free bets.",
};

export default function OffersPage() {
    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
            {/* Hero Section for Offers */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Best Betting Offers</h1>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                    Boost your winnings with exclusive bonuses and promotions from top betting sites.
                </p>
            </div>

            <PromotionGrid count={100} title="" showLink={false} showEmptyState={true} />
        </div>
    );
}

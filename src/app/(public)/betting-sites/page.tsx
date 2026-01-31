import { Metadata } from "next";
import { AllBettingSitesGrid } from "@/components/sections/AllBettingSitesGrid";
import { SEOContent } from "@/components/sections/SEOContent";
import { FAQSection } from "@/components/sections/FAQSection";
import { PremiumBettingSiteList } from "@/components/sections/PremiumBettingSiteList";

export const metadata: Metadata = {
    title: "All Online Betting Sites | Cricknow",
    description: "Browse our complete list of verified and reviewed online betting sites in India. Compare bonuses, features, and ratings to find your perfect match.",
};

export default function BettingSitesPage() {
    const faqItems = [
        {
            question: "Are all these betting sites legal in India?",
            answer: "All the sites listed on Cricknow are offshore operators that accept Indian players. While there are no central federal laws prohibiting them, we recommend checking your local state regulations."
        },
        {
            question: "Which site has the best withdrawal time?",
            answer: "Withdrawal times vary, but sites like Parimatch, 1xBet, and Stake are known for their fast processing speeds, often within hours."
        },
        {
            question: "Can I claim bonuses on multiple sites?",
            answer: "Yes! You can register on multiple betting sites and claim the welcome bonus on each one, provided you are a new customer to that specific platform."
        }
    ];

    return (
        <div className="bg-white dark:bg-black min-h-screen">
            {/* Simple Header - Premium B&W */}
            <div className="pt-24 pb-10 text-center border-b border-gray-100 dark:border-neutral-900 bg-white dark:bg-black">
                <div className="container mx-auto px-4">
                    {/* Badge/Pill - Black Outline */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black dark:border-white mb-6">
                        <span className="text-[10px] font-bold text-black dark:text-white uppercase tracking-widest">#1 Trusted Betting Reviews</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-black dark:text-white mb-6">
                        ALL BETTING SITES
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
                        A complete directory of trustworthy online bookmakers for Indian players.
                    </p>
                </div>
            </div>

            <div id="all-sites" className="min-h-screen">
                <PremiumBettingSiteList count={100} />
            </div>

            <SEOContent />

            <div className="border-t border-gray-100 dark:border-neutral-900">
                <FAQSection items={faqItems} title="Betting Sites FAQ" description="Common questions about choosing a bookmaker." />
            </div>
        </div>
    );
}

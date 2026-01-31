import { BettingSiteList } from "@/components/sections/BettingSiteList";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Best Online Cricket Betting Sites | Reviews & Ratings",
    description: "Compare the top cricket betting sites. Read expert reviews, check ratings, and find the best platforms.",
};

export default function SitesPage() {
    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
            {/* Hero Section for Sites */}
            <div className="bg-neutral-dark text-white py-20 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Top Betting Sites</h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Trusted, reviewed, and ranked. Find the perfect betting platform for you.
                </p>
            </div>

            <BettingSiteList count={100} filter="all" showEmptyState={true} />
        </div>
    );
}

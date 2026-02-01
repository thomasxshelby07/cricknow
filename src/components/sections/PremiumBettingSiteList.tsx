import connectToDatabase from "@/lib/db";
import { BettingSite } from "@/models/BettingSite";
import { PremiumBettingSiteListClient } from "./PremiumBettingSiteListClient";

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

    // Convert MongoDB documents to plain objects for client component
    const plainSites = sites.map((site: any) => ({
        _id: site._id.toString(),
        name: site.name,
        slug: site.slug,
        logoUrl: site.logoUrl,
        rating: site.rating,
        shortDescription: site.shortDescription,
        badges: site.badges,
        joiningBonus: site.joiningBonus,
        reDepositBonus: site.reDepositBonus,
        affiliateLink: site.affiliateLink
    }));

    return <PremiumBettingSiteListClient sites={plainSites} showEmptyState={showEmptyState} />;
}

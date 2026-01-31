import { Promotion } from "@/models/Promotion";
import connectToDatabase from "@/lib/db";

export async function getAdsForPage(contextType: 'blog' | 'news', contextId: string) {
    try {
        await connectToDatabase();

        // Fetch all published ad banners
        const allAds = await Promotion.find({
            type: 'ad_banner',
            'visibility.status': 'published'
        }).sort({ updatedAt: -1 }).lean();

        if (!allAds || allAds.length === 0) return [];

        // Filter based on targeting logic
        const matchingAds = allAds.filter((ad: any) => {
            const settings = ad.displaySettings || { mode: 'all' };

            if (settings.mode === 'all') {
                return true;
            }

            if (settings.mode === 'specific') {
                if (contextType === 'blog') {
                    return settings.includedBlogs?.map((id: any) => id.toString()).includes(contextId.toString());
                } else if (contextType === 'news') {
                    return settings.includedNews?.map((id: any) => id.toString()).includes(contextId.toString());
                }
            }

            return false;
        });

        // Serialize
        return JSON.parse(JSON.stringify(matchingAds));
    } catch (error) {
        console.error("Failed to fetch ads:", error);
        return [];
    }
}

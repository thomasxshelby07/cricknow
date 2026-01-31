import { HomeConfigForm } from "@/components/admin/HomeConfigForm";
import connectToDatabase from "@/lib/db";
import { HomePageConfig } from "@/models/HomePageConfig";
import { BettingSite } from "@/models/BettingSite";
import { Blog } from "@/models/Blog";
import { News } from "@/models/News";

export const dynamic = 'force-dynamic';

async function getData() {
    await connectToDatabase();

    // 1. Get Config
    let config = await HomePageConfig.findOne({ isDefault: true }).lean();
    if (!config) {
        config = await HomePageConfig.create({ isDefault: true });
        config = config.toObject(); // Make it plain JSON
    }

    // 2. Get All Items (for selection)
    const sites = await BettingSite.find({}, 'name isFeatured').sort({ createdAt: -1 }).lean();
    const blogs = await Blog.find({}, 'title category').sort({ createdAt: -1 }).lean();
    const news = await News.find({}, 'title').sort({ createdAt: -1 }).lean();

    return {
        initialConfig: JSON.parse(JSON.stringify(config)), // Serialization
        allSites: JSON.parse(JSON.stringify(sites)),
        allBlogs: JSON.parse(JSON.stringify(blogs)),
        allNews: JSON.parse(JSON.stringify(news))
    };
}

export default async function AdminHomeConfigPage() {
    const data = await getData();

    return (
        <div className="p-8">
            <HomeConfigForm {...data} />
        </div>
    );
}

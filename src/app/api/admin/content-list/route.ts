import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Blog } from "@/models/Blog";
import { News } from "@/models/News";
import Game from "@/models/Game";

export async function GET() {
    try {
        await connectToDatabase();
        // Fetch simple list of ID + Title for selection
        // Ensure models are compiled
        const _b = Blog;
        const _n = News;
        const _g = Game;

        const [blogs, news, games] = await Promise.all([
            Blog.find({}, 'title _id').sort({ createdAt: -1 }).lean(),
            News.find({}, 'title _id').sort({ createdAt: -1 }).lean(),
            Game.find({}, 'title _id').sort({ createdAt: -1 }).lean()
        ]);

        return NextResponse.json({ blogs, news, games });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch content list" }, { status: 500 });
    }
}

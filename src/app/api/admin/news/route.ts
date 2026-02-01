import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { News } from "@/models/News";
import { slugify } from "@/lib/utils";
import { hasPermission } from "@/lib/permissions";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Check permission
        if (!hasPermission(session.user, 'manage_news')) {
            return NextResponse.json({ error: "You don't have permission to manage news" }, { status: 403 });
        }

        await connectToDatabase();
        const body = await req.json();

        if (!body.title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

        let finalSlug = body.slug ? slugify(body.slug) : slugify(body.title);
        if (!finalSlug) return NextResponse.json({ error: "Invalid slug" }, { status: 400 });

        const existing = await News.findOne({ slug: finalSlug });
        if (existing) return NextResponse.json({ error: "Slug already exists" }, { status: 400 });

        const newsData = {
            title: body.title,
            slug: finalSlug,
            summary: body.summary,
            content: body.content,
            coverImageUrl: body.coverImageUrl,
            relatedSites: body.relatedSites,
            relatedNews: body.relatedNews,
            relatedBlogs: body.relatedBlogs,
            customH1: body.customH1,
            lastUpdated: body.lastUpdated,
            internalLinks: body.internalLinks,
            faqs: body.faqs,
            seo: body.seo,
            visibility: body.visibility,
            isFeatured: body.isFeatured
        };

        const newNews = await News.create(newsData);
        return NextResponse.json({ success: true, data: newNews }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const news = await News.find({}).sort({ 'visibility.displayOrder': 1, createdAt: -1 });
        return NextResponse.json({ success: true, data: news });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const { items } = await req.json();

        // Bulk update displayOrder for all items
        const updatePromises = items.map((item: any, index: number) =>
            News.findByIdAndUpdate(item._id, { 'visibility.displayOrder': index })
        );

        await Promise.all(updatePromises);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


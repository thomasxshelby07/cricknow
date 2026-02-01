import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { News } from "@/models/News";
import "@/models/BettingSite";
import "@/models/Blog";
import "@/models/Coupon";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const news = await News.findById(id)
            .populate('relatedSites')
            .populate('relatedNews')
            .populate('relatedBlogs')
            .populate('relatedCoupons');
        if (!news) return NextResponse.json({ error: "News not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: news });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const body = await req.json();

        // Check slug uniqueness if changed
        if (body.slug) {
            const existing = await News.findOne({ slug: body.slug, _id: { $ne: id } });
            if (existing) return NextResponse.json({ error: "Slug already taken" }, { status: 400 });
        }

        const updatedNews = await News.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...body,
                    relatedSites: body.relatedSites,
                    relatedNews: body.relatedNews,
                    relatedBlogs: body.relatedBlogs,
                    relatedCoupons: body.relatedCoupons
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedNews) return NextResponse.json({ error: "News not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: updatedNews });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const deleted = await News.findByIdAndDelete(id);

        if (!deleted) return NextResponse.json({ error: "News not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "News deleted" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

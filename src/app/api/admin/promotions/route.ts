import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Promotion } from "@/models/Promotion";

export async function GET() {
    try {
        await connectToDatabase();
        const promotions = await Promotion.find({ type: 'ad_banner' }).sort({ createdAt: -1 });
        return NextResponse.json(promotions);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch promotions" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const body = await req.json();

        // Generate a slug if not provided (simple one)
        if (!body.slug) {
            body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
        }

        const promotion = await Promotion.create({
            ...body,
            type: 'ad_banner' // Force type for now as we are building the Ad system
        });

        return NextResponse.json(promotion);
    } catch (error) {
        console.error("Error creating promotion:", error);
        return NextResponse.json({
            error: "Failed to create promotion",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

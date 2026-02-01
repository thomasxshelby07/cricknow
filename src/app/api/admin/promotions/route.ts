import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Promotion } from "@/models/Promotion";
import { hasPermission } from "@/lib/permissions";

export async function GET() {
    try {
        await connectToDatabase();
        const promotions = await Promotion.find({ type: 'ad_banner' }).sort({ 'visibility.displayOrder': 1, createdAt: -1 });
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

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Check permission
        if (!hasPermission(session.user, 'manage_promotions')) {
            return NextResponse.json({ error: "You don't have permission to manage promotions" }, { status: 403 });
        }

        await connectToDatabase();
        const { items } = await req.json();

        // Bulk update displayOrder for all items
        const updatePromises = items.map((item: any, index: number) =>
            Promotion.findByIdAndUpdate(item._id, { 'visibility.displayOrder': index })
        );

        await Promise.all(updatePromises);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

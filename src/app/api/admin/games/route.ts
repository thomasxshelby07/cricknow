import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Game from "@/models/Game";
import { slugify } from "@/lib/utils";
import { hasPermission } from "@/lib/permissions";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Check permission
        if (!hasPermission(session.user, 'manage_games')) {
            return NextResponse.json({ error: "You don't have permission to manage games" }, { status: 403 });
        }

        await connectToDatabase();
        const body = await req.json();

        let finalSlug = body.slug || slugify(body.title);

        // Check unique slug
        const existing = await Game.findOne({ slug: finalSlug });
        if (existing) {
            return NextResponse.json({ error: "Slug already exists. Please choose another." }, { status: 400 });
        }

        const newGame = await Game.create({
            ...body,
            slug: finalSlug
        });

        return NextResponse.json({ success: true, data: newGame }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        // For admin list, return all fields.
        const games = await Game.find({}).sort({ 'visibility.displayOrder': 1, createdAt: -1 });
        return NextResponse.json({ success: true, data: games });
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
            Game.findByIdAndUpdate(item._id, { 'visibility.displayOrder': index })
        );

        await Promise.all(updatePromises);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


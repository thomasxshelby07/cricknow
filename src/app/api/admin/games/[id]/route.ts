import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Game from "@/models/Game";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const game = await Game.findById(id);
        if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });
        return NextResponse.json({ success: true, data: game });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const body = await req.json();
        const { id } = await params;

        // Prevent Slug Collision if slug is changed
        if (body.slug) {
            const existing = await Game.findOne({ slug: body.slug, _id: { $ne: id } });
            if (existing) {
                return NextResponse.json({ error: "Slug already taken by another game." }, { status: 400 });
            }
        }

        const updatedGame = await Game.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!updatedGame) return NextResponse.json({ error: "Game not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: updatedGame });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const { id } = await params;
        const deletedGame = await Game.findByIdAndDelete(id);
        if (!deletedGame) return NextResponse.json({ error: "Game not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Game deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

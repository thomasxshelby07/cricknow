import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import GameCategory from "@/models/GameCategory";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectToDatabase();
        const category = await GameCategory.findById(id);
        if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
        return NextResponse.json({ success: true, data: category });
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

        if (body.slug) {
            const existing = await GameCategory.findOne({ slug: body.slug, _id: { $ne: id } });
            if (existing) {
                return NextResponse.json({ error: "Slug already taken." }, { status: 400 });
            }
        }

        const updated = await GameCategory.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!updated) return NextResponse.json({ error: "Category not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: updated });
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
        const deleted = await GameCategory.findByIdAndDelete(id);
        if (!deleted) return NextResponse.json({ error: "Category not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Category deleted" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

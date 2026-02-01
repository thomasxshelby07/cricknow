import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import GameCategory from "@/models/GameCategory";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const body = await req.json();

        let finalSlug = body.slug || slugify(body.name);

        const existing = await GameCategory.findOne({ slug: finalSlug });
        if (existing) {
            return NextResponse.json({ error: "Category slug already exists." }, { status: 400 });
        }

        const newCategory = await GameCategory.create({
            ...body,
            slug: finalSlug
        });

        return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const categories = await GameCategory.find({}).sort({ displayOrder: 1, createdAt: -1 });
        return NextResponse.json({ success: true, data: categories });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

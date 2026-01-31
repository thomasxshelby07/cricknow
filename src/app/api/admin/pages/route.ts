import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Page } from "@/models/Page";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const body = await req.json();

        let finalSlug = body.slug || slugify(body.title);
        if (!finalSlug.startsWith("/")) finalSlug = "/" + finalSlug;

        const existing = await Page.findOne({ slug: finalSlug });
        if (existing) {
            return NextResponse.json({ error: "Slug already exists." }, { status: 400 });
        }

        const newPage = await Page.create({
            ...body,
            slug: finalSlug
        });

        return NextResponse.json({ success: true, data: newPage }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const pages = await Page.find({}).sort({ updatedAt: -1 });
        return NextResponse.json({ success: true, data: pages });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Blog } from "@/models/Blog";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const body = await req.json();

        let finalSlug = body.slug || slugify(body.title);

        const existing = await Blog.findOne({ slug: finalSlug });
        if (existing) {
            return NextResponse.json({ error: "Slug already exists." }, { status: 400 });
        }

        const newBlog = await Blog.create({
            ...body,
            ...body,
            relatedNews: body.relatedNews || [],
            slug: finalSlug
        });

        return NextResponse.json({ success: true, data: newBlog }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const blogs = await Blog.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: blogs });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

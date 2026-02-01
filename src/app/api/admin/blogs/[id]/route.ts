import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Blog } from "@/models/Blog";
import "@/models/BettingSite";
import "@/models/News";
import "@/models/Coupon";
import { slugify } from "@/lib/utils";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> } // Correct type for Next.js 15
) {
    try {
        const { id } = await context.params; // Await params in Next.js 15
        if (!id) return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });

        await connectToDatabase();
        const blog = await Blog.findById(id).populate('relatedSites').populate('relatedBlogs');

        if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: blog });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> } // Correct type for Next.js 15
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await context.params; // Await params in Next.js 15
        if (!id) return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });

        await connectToDatabase();
        const body = await req.json();

        // If slug is being updated, check for uniqueness
        if (body.slug) {
            const existing = await Blog.findOne({ slug: body.slug, _id: { $ne: id } });
            if (existing) {
                return NextResponse.json({ error: "Slug already exists." }, { status: 400 });
            }
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        ).populate('relatedSites').populate('relatedBlogs').populate('relatedNews').populate('relatedCoupons');

        if (!updatedBlog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedBlog });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> } // Correct type for Next.js 15
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await context.params; // Await params in Next.js 15

        await connectToDatabase();
        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Blog deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

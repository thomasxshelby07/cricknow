import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Page } from "@/models/Page";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectToDatabase();
        const page = await Page.findById(params.id);
        if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });
        return NextResponse.json({ success: true, data: page });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const body = await req.json();

        // Prevent slug change if System Page (safety check)
        // const existing = await Page.findById(params.id);
        // if (existing.type === 'system' && body.slug !== existing.slug) {
        //     return NextResponse.json({ error: "Cannot change slug of System Pages." }, { status: 400 });
        // }

        const updatedPage = await Page.findByIdAndUpdate(params.id, body, { new: true });
        return NextResponse.json({ success: true, data: updatedPage });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        await Page.findByIdAndDelete(params.id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

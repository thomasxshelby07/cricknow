import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Promotion } from "@/models/Promotion";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { id } = await params;

        const updatedPromotion = await Promotion.findByIdAndUpdate(id, body, { new: true });

        if (!updatedPromotion) {
            return NextResponse.json({ error: "Promotion not found" }, { status: 404 });
        }

        return NextResponse.json(updatedPromotion);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update promotion" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const { id } = await params;

        await Promotion.findByIdAndDelete(id);

        return NextResponse.json({ message: "Promotion deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete promotion" }, { status: 500 });
    }
}

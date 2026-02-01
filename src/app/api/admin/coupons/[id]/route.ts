import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Coupon } from "@/models/Coupon";

// GET single coupon
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectToDatabase();
        const coupon = await Coupon.findById(id).lean();

        if (!coupon) {
            return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
        }

        return NextResponse.json(coupon);
    } catch (error) {
        console.error("Error fetching coupon:", error);
        return NextResponse.json({ error: "Failed to fetch coupon" }, { status: 500 });
    }
}

// PUT update coupon
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectToDatabase();
        const body = await request.json();

        const coupon = await Coupon.findByIdAndUpdate(id, body, { new: true });

        if (!coupon) {
            return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
        }

        return NextResponse.json(coupon);
    } catch (error) {
        console.error("Error updating coupon:", error);
        return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
    }
}

// DELETE coupon
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectToDatabase();
        const coupon = await Coupon.findByIdAndDelete(id);

        if (!coupon) {
            return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Coupon deleted successfully" });
    } catch (error) {
        console.error("Error deleting coupon:", error);
        return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
    }
}

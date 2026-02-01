import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Coupon } from "@/models/Coupon";
import { hasPermission } from "@/lib/permissions";

// GET all coupons (search support)
export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");

        let filter = {};
        if (query) {
            filter = {
                $or: [
                    { name: { $regex: query, $options: "i" } },
                    { couponCode: { $regex: query, $options: "i" } }
                ]
            };
        }

        const coupons = await Coupon.find(filter)
            .sort({ 'visibility.displayOrder': 1, createdAt: -1 })
            .lean();

        return NextResponse.json({ success: true, data: coupons });
    } catch (error) {
        console.error("Error fetching coupons:", error);
        return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
    }
}

// POST create new coupon
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Check permission
        if (!hasPermission(session.user, 'manage_coupons')) {
            return NextResponse.json({ error: "You don't have permission to manage coupons" }, { status: 403 });
        }

        await connectToDatabase();
        const body = await request.json();

        const coupon = await Coupon.create(body);

        return NextResponse.json(coupon, { status: 201 });
    } catch (error) {
        console.error("Error creating coupon:", error);
        return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        await connectToDatabase();
        const { items } = await req.json();

        // Bulk update displayOrder for all items
        const updatePromises = items.map((item: any, index: number) =>
            Coupon.findByIdAndUpdate(item._id, { 'visibility.displayOrder': index })
        );

        await Promise.all(updatePromises);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


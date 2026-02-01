import { notFound } from "next/navigation";
import { CouponForm } from "@/components/admin/coupons/CouponForm";
import connectToDatabase from "@/lib/db";
import { Coupon } from "@/models/Coupon";

async function getCoupon(id: string) {
    await connectToDatabase();
    const coupon = await Coupon.findById(id).lean();
    return coupon ? JSON.parse(JSON.stringify(coupon)) : null;
}

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const coupon = await getCoupon(id);

    if (!coupon) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-black dark:text-white">Edit Coupon</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Update coupon details and settings</p>
            </div>

            <CouponForm initialData={coupon} isEdit={true} />
        </div>
    );
}

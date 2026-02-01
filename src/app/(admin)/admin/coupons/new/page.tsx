import { CouponForm } from "@/components/admin/coupons/CouponForm";

export default function NewCouponPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-black dark:text-white">Create New Coupon</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Add a new promotional coupon or offer</p>
            </div>

            <CouponForm />
        </div>
    );
}

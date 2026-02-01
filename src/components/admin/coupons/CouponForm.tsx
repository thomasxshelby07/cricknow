"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

interface CouponFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export function CouponForm({ initialData, isEdit = false }: CouponFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || "");

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        offer: initialData?.offer || "",
        couponCode: initialData?.couponCode || "",
        bonusAmount: initialData?.bonusAmount || "",
        buttonText: initialData?.buttonText || "Claim Now",
        redirectLink: initialData?.redirectLink || "",

        // Visibility
        showOnHome: initialData?.showOnHome || false,
        showOnBlog: initialData?.showOnBlog || false,
        showOnNews: initialData?.showOnNews || false,
        showOnBonuses: initialData?.showOnBonuses !== undefined ? initialData.showOnBonuses : true,

        // Status
        status: initialData?.visibility?.status || "draft",
        displayOrder: initialData?.visibility?.displayOrder || 0,
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `Upload failed with status ${res.status}`);
            }

            const data = await res.json();
            setImagePreview(data.url);
        } catch (error: any) {
            console.error("Upload failed details:", error);
            toast.error(error.message || "Failed to upload image. Please check file size (<4MB).");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                imageUrl: imagePreview,
                visibility: {
                    status: formData.status,
                    displayOrder: formData.displayOrder,
                },
            };

            const url = isEdit ? `/api/admin/coupons/${initialData._id}` : "/api/admin/coupons";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to save coupon");

            toast.success(isEdit ? "Coupon updated!" : "Coupon created!");
            router.push("/admin/coupons");
            router.refresh();
        } catch (error) {
            toast.error("Failed to save coupon");
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = () => {
        const slug = formData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        setFormData({ ...formData, slug });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg border border-gray-200 dark:border-neutral-800">
                <h3 className="text-lg font-bold mb-4">Basic Information</h3>
                <div className="space-y-4">
                    <div>
                        <Label>Coupon Name *</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            onBlur={generateSlug}
                            required
                            placeholder="e.g., IPL 2024 Special Offer"
                        />
                    </div>

                    <div>
                        <Label>Slug *</Label>
                        <Input
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            required
                            placeholder="ipl-2024-special-offer"
                        />
                    </div>

                    <div>
                        <Label>Offer Description *</Label>
                        <Textarea
                            value={formData.offer}
                            onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
                            placeholder="Get up to 500% bonus on your first deposit..."
                            rows={3}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Bonus Amount</Label>
                            <Input
                                value={formData.bonusAmount}
                                onChange={(e) => setFormData({ ...formData, bonusAmount: e.target.value })}
                                placeholder="500% Bonus"
                            />
                        </div>
                        <div>
                            <Label>Coupon Code</Label>
                            <Input
                                value={formData.couponCode}
                                onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                                placeholder="CRICKET500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Settings */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg border border-gray-200 dark:border-neutral-800">
                <h3 className="text-lg font-bold mb-4">Call-to-Action</h3>
                <div className="space-y-4">
                    <div>
                        <Label>Button Text *</Label>
                        <Input
                            value={formData.buttonText}
                            onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                            required
                            placeholder="Claim Bonus Now"
                        />
                    </div>

                    <div>
                        <Label>Redirect Link *</Label>
                        <Input
                            value={formData.redirectLink}
                            onChange={(e) => setFormData({ ...formData, redirectLink: e.target.value })}
                            required
                            placeholder="https://example.com/offer"
                            type="url"
                        />
                    </div>
                </div>
            </div>

            {/* Image Upload */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg border border-gray-200 dark:border-neutral-800">
                <h3 className="text-lg font-bold mb-4">Coupon Image</h3>
                <div className="space-y-4">
                    {imagePreview && (
                        <div className="relative">
                            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                            <button
                                type="button"
                                onClick={() => setImagePreview("")}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    <div>
                        <Label htmlFor="image-upload" className="cursor-pointer">
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
                                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Click to upload coupon banner
                                </p>
                            </div>
                        </Label>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>
                </div>
            </div>

            {/* Visibility Settings */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg border border-gray-200 dark:border-neutral-800">
                <h3 className="text-lg font-bold mb-4">Visibility Settings</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.showOnHome}
                                onChange={(e) => setFormData({ ...formData, showOnHome: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-medium">Show on Home Page</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.showOnBlog}
                                onChange={(e) => setFormData({ ...formData, showOnBlog: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-medium">Show on Blog Pages</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.showOnNews}
                                onChange={(e) => setFormData({ ...formData, showOnNews: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-medium">Show on News Pages</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.showOnBonuses}
                                onChange={(e) => setFormData({ ...formData, showOnBonuses: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-medium">Show on Bonuses Page</span>
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Status</Label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>

                        <div>
                            <Label>Display Order</Label>
                            <Input
                                type="number"
                                value={formData.displayOrder}
                                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Saving..." : isEdit ? "Update Coupon" : "Create Coupon"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/coupons")}
                    className="flex-1"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}

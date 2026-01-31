import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, PenSquare, Trash2, Megaphone } from "lucide-react";
import connectToDatabase from "@/lib/db";
import { Promotion } from "@/models/Promotion";
import { Badge } from "@/components/ui/badge";
import { DeletePromotionButton } from "@/components/admin/promotions/DeletePromotionButton";

async function getPromotions() {
    await connectToDatabase();
    // Fetch Ad Banners specifically, or all? User focused on Ads.
    // Let's show Ad Banners at the top or exclusively.
    // Given the request, I'll filter for ad_banner mostly, but maybe show others or label them.
    // For now, let's fetch 'ad_banner' type.
    return await Promotion.find({ type: 'ad_banner' }).sort({ createdAt: -1 }).lean();
}

export const dynamic = 'force-dynamic';

export default async function PromotionsPage() {
    const promotions = await getPromotions();

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Megaphone className="w-6 h-6 text-primary" /> Ad Campaigns
                    </h1>
                    <p className="text-gray-500">Manage promotional banners for sidebar and in-content ads.</p>
                </div>
                <Link href="/admin/promotions/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" /> CREATE NEW AD
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {promotions.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No Ads Created Yet</h3>
                        <p className="text-gray-500 mb-6">Create your first advertisement to monetize your content.</p>
                        <Link href="/admin/promotions/new">
                            <Button variant="outline">Create Ad</Button>
                        </Link>
                    </div>
                ) : (promotions.map((promo: any) => (
                    <div key={promo._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden group flex flex-col">

                        {/* Preview Area */}
                        <div className="aspect-[2/1] bg-gray-100 dark:bg-gray-900 relative flex items-center justify-center p-4 border-b">
                            {promo.images?.horizontal ? (
                                <img src={promo.images.horizontal} alt="Preview" className="max-w-full max-h-full object-contain" />
                            ) : (
                                <span className="text-xs text-gray-400">No Horizontal Image</span>
                            )}

                            <div className="absolute top-2 right-2">
                                <Badge variant={promo.visibility?.status === 'published' ? 'default' : 'secondary'}>
                                    {promo.visibility?.status || 'Draft'}
                                </Badge>
                            </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-bold text-lg mb-1 truncate" title={promo.title}>{promo.title}</h3>
                            <div className="text-xs text-gray-500 mb-4 space-y-1">
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">Button:</span> {promo.ctaText}
                                </div>
                                <div className="flex items-center gap-1 truncate" title={promo.redirectUrl}>
                                    <span className="font-medium">Link:</span> {promo.redirectUrl}
                                </div>
                            </div>

                            <div className="mt-auto flex items-center justify-end gap-2 pt-3 border-t">
                                <Link href={`/admin/promotions/${promo._id}`}>
                                    <Button size="sm" variant="outline" className="h-8">
                                        <PenSquare className="w-3 h-3 mr-1" /> Edit
                                    </Button>
                                </Link>
                                <DeletePromotionButton id={promo._id.toString()} />
                            </div>
                        </div>
                    </div>
                )))}
            </div>
        </div>
    );
}

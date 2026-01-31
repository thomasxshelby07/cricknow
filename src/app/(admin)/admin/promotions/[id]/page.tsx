import { PromotionForm } from "@/components/admin/promotions/PromotionForm";
import connectToDatabase from "@/lib/db";
import { Promotion } from "@/models/Promotion";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EditPromotionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await connectToDatabase();

    let promotion;
    try {
        promotion = await Promotion.findById(id).lean();
    } catch (e) {
        return notFound();
    }

    if (!promotion) return notFound();

    // Serialize _id
    const serialized = JSON.parse(JSON.stringify(promotion));

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/promotions">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Edit Ad Campaign</h1>
            </div>
            <PromotionForm initialData={serialized} isEditing={true} />
        </div>
    );
}

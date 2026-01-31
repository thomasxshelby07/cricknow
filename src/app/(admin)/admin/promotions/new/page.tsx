import { PromotionForm } from "@/components/admin/promotions/PromotionForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewPromotionPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/promotions">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Create New Ad Campaign</h1>
            </div>
            <PromotionForm />
        </div>
    );
}

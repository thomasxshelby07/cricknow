"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeletePromotionButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this ad?")) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/admin/promotions/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error("Failed");

            toast.success("Ad deleted");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            size="sm"
            variant="ghost"
            className="h-8 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={handleDelete}
            disabled={loading}
        >
            <Trash2 className="w-3 h-3" />
        </Button>
    );
}

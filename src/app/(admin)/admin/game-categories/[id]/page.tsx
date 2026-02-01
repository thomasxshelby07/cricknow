"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryForm } from "@/components/admin/games/CategoryForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function CategoryEditorPage({ params }: { params: { id: string } }) {
    const isNew = params.id === 'new';
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(!isNew);

    useEffect(() => {
        if (!isNew) {
            fetch(`/api/admin/game-categories/${params.id}`)
                .then(res => res.json())
                .then(json => {
                    if (json.success) setData(json.data);
                    setLoading(false);
                });
        }
    }, [isNew, params.id]);

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-3xl font-bold">{isNew ? "Create Category" : "Edit Category"}</h1>
            </div>

            <CategoryForm initialData={data} id={params.id} />
        </div>
    );
}

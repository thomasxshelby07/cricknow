"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";

interface CategoryFormData {
    name: string;
    slug: string;
    description: string;
    iconUrl: string;
    linkPath: string;
    displayOrder: number;
}

interface CategoryFormProps {
    initialData?: CategoryFormData;
    id?: string; // If 'new', it's create mode
}

export function CategoryForm({ initialData, id }: CategoryFormProps) {
    const isNew = id === 'new';
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [data, setData] = useState<CategoryFormData>(initialData || {
        name: "",
        slug: "",
        description: "",
        iconUrl: "",
        linkPath: "",
        displayOrder: 0
    });

    const updateData = (updates: Partial<CategoryFormData>) => {
        setData(prev => ({ ...prev, ...updates }));
    };

    const handleUpload = async (file: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            if (!res.ok) throw new Error("Upload failed");
            const json = await res.json();
            updateData({ iconUrl: json.url });
            toast.success("Icon uploaded!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload icon.");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const url = isNew ? "/api/admin/game-categories" : `/api/admin/game-categories/${id}`;
            const method = isNew ? "POST" : "PUT";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const json = await res.json();

            if (res.ok) {
                toast.success(isNew ? "Category created!" : "Category updated!");
                router.push("/admin/game-categories");
                router.refresh();
            } else {
                toast.error(json.error || "Save failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl bg-white p-6 rounded-lg shadow-sm border">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Category Name *</Label>
                    <Input value={data.name} onChange={(e) => updateData({ name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input value={data.slug} onChange={(e) => updateData({ slug: e.target.value })} placeholder="auto-generated" />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={data.description} onChange={(e) => updateData({ description: e.target.value })} />
            </div>

            <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                <Label>Icon / Image</Label>
                <div className="flex items-center gap-4">
                    {data.iconUrl ? (
                        <div className="relative w-16 h-16 border rounded bg-white overflow-hidden flex items-center justify-center">
                            <img src={data.iconUrl} alt="Icon" className="w-10 h-10 object-contain" />
                            <button
                                onClick={() => updateData({ iconUrl: "" })}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ) : (
                        <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center bg-white text-gray-400">
                            Icon
                        </div>
                    )}
                    <div className="flex-1 space-y-2">
                        <Input
                            type="file"
                            accept="image/*"
                            disabled={uploading}
                            onChange={(e) => {
                                if (e.target.files?.[0]) handleUpload(e.target.files[0]);
                            }}
                        />
                        <Input
                            placeholder="Or enter Image URL"
                            value={data.iconUrl || ""}
                            onChange={(e) => updateData({ iconUrl: e.target.value })}
                        />
                    </div>
                </div>
                {uploading && <div className="text-primary flex items-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> Uploading...</div>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Link Path (Redirect)</Label>
                    <Input value={data.linkPath} onChange={(e) => updateData({ linkPath: e.target.value })} placeholder="/online-casino" />
                    <p className="text-xs text-gray-500">Redirects user when clicked. Keep empty if purely a filter.</p>
                </div>
                <div className="space-y-2">
                    <Label>Display Order</Label>
                    <Input type="number" value={data.displayOrder} onChange={(e) => updateData({ displayOrder: parseInt(e.target.value) })} />
                </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? <Loader2 className="mr-2 animate-spin" /> : <Save className="mr-2 w-4 h-4" />}
                Save Category
            </Button>
        </div>
    );
}

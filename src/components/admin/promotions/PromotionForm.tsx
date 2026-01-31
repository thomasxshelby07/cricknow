"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X, Save, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface PromotionFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export function PromotionForm({ initialData, isEditing = false }: PromotionFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        type: "ad_banner",
        ctaText: initialData?.ctaText || "Check it out",
        redirectUrl: initialData?.redirectUrl || "",
        images: {
            vertical: initialData?.images?.vertical || "",
            horizontal: initialData?.images?.horizontal || ""
        },
        visibility: {
            status: initialData?.visibility?.status || "published",
        },
        displaySettings: {
            mode: initialData?.displaySettings?.mode || 'all',
            includedBlogs: initialData?.displaySettings?.includedBlogs || [],
            includedNews: initialData?.displaySettings?.includedNews || []
        }
    });

    const [contentList, setContentList] = useState<{ blogs: any[], news: any[] }>({ blogs: [], news: [] });

    useEffect(() => {
        // Fetch list of blogs and news for targeting
        fetch('/api/admin/content-list')
            .then(res => res.json())
            .then(data => {
                if (data.blogs) setContentList(data);
            })
            .catch(err => console.error("Failed to load content list", err));
    }, []);

    const toggleSelection = (type: 'blogs' | 'news', id: string) => {
        const field = type === 'blogs' ? 'includedBlogs' : 'includedNews';
        const current = formData.displaySettings[field] as string[];
        const next = current.includes(id)
            ? current.filter(i => i !== id)
            : [...current, id];

        setFormData(prev => ({
            ...prev,
            displaySettings: {
                ...prev.displaySettings,
                [field]: next
            }
        }));
    };

    const handleUpload = async (file: File, type: 'vertical' | 'horizontal') => {
        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formDataUpload,
            });

            if (!res.ok) throw new Error("Upload failed");

            const json = await res.json();
            setFormData(prev => ({
                ...prev,
                images: {
                    ...prev.images,
                    [type]: json.url
                }
            }));
            toast.success(`${type} image uploaded!`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEditing
                ? `/api/admin/promotions/${initialData._id}`
                : "/api/admin/promotions";

            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to save promotion");

            toast.success(isEditing ? "Promotion updated!" : "Promotion created!");
            router.push("/admin/promotions");
            router.refresh();

        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Basic Info & Targeting */}
                <div className="space-y-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <div>
                            <Label className="text-base">Ad Name (Internal)</Label>
                            <Input
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. IPL 2026 Main Banner"
                                required
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={formData.visibility.status}
                                    onValueChange={(val) => setFormData({ ...formData, visibility: { ...formData.visibility, status: val } })}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft (Hidden)</SelectItem>
                                        <SelectItem value="published">Published (Live)</SelectItem>
                                        <SelectItem value="hidden">Hidden</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-gray-800" />

                    {/* Display Targeting */}
                    <div className="space-y-4">
                        <h3 className="text-base font-semibold">Display Settings</h3>

                        <div className="flex items-center gap-4">
                            <Label>Where to show?</Label>
                            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, displaySettings: { ...prev.displaySettings, mode: 'all' } }))}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${formData.displaySettings.mode === 'all' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
                                >
                                    Global (All Pages)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, displaySettings: { ...prev.displaySettings, mode: 'specific' } }))}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${formData.displaySettings.mode === 'specific' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
                                >
                                    Specific Pages
                                </button>
                            </div>
                        </div>

                        {formData.displaySettings.mode === 'specific' && (
                            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                                {/* Blogs Selection */}
                                <div className="space-y-2">
                                    <Label className="flex justify-between">
                                        <span>Select Blogs</span>
                                        <span className="text-xs text-gray-500">{formData.displaySettings.includedBlogs.length} selected</span>
                                    </Label>
                                    <div className="h-40 overflow-y-auto border rounded bg-white p-2 space-y-1">
                                        {contentList.blogs.map((blog: any) => (
                                            <label key={blog._id} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded cursor-pointer text-sm">
                                                <Checkbox
                                                    checked={formData.displaySettings.includedBlogs.includes(blog._id)}
                                                    onCheckedChange={() => toggleSelection('blogs', blog._id)}
                                                />
                                                <span className="truncate">{blog.title}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* News Selection */}
                                <div className="space-y-2">
                                    <Label className="flex justify-between">
                                        <span>Select News</span>
                                        <span className="text-xs text-gray-500">{formData.displaySettings.includedNews.length} selected</span>
                                    </Label>
                                    <div className="h-40 overflow-y-auto border rounded bg-white p-2 space-y-1">
                                        {contentList.news.map((item: any) => (
                                            <label key={item._id} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded cursor-pointer text-sm">
                                                <Checkbox
                                                    checked={formData.displaySettings.includedNews.includes(item._id)}
                                                    onCheckedChange={() => toggleSelection('news', item._id)}
                                                />
                                                <span className="truncate">{item.title}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: CTA & Button */}
                <div className="space-y-6">
                    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                        <h3 className="font-semibold flex items-center gap-2">
                            <ExternalLink className="w-4 h-4 text-primary" /> Call to Action
                        </h3>

                        <div className="space-y-3">
                            <Label>Button Text</Label>
                            <Input
                                value={formData.ctaText}
                                onChange={e => setFormData({ ...formData, ctaText: e.target.value })}
                                placeholder="e.g. Claim Bonus Now"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label>Destination URL</Label>
                            <Input
                                value={formData.redirectUrl}
                                onChange={e => setFormData({ ...formData, redirectUrl: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-px bg-gray-100 dark:bg-gray-800 my-6" />

            {/* Images Section */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold">Ad Creatives</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Vertical Image */}
                    <div className="space-y-4">
                        <Label className="flex justify-between">
                            <span>Vertical Image (Sidebar)</span>
                            <span className="text-xs text-gray-500 font-normal">Recommended: 300x600px</span>
                        </Label>

                        <div className={`relative border-2 border-dashed rounded-xl p-4 transition-colors ${formData.images.vertical ? 'border-primary/20 bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                            {formData.images.vertical ? (
                                <div className="relative aspect-[1/2] w-full bg-white rounded-lg overflow-hidden shadow-sm">
                                    <img src={formData.images.vertical} className="w-full h-full object-contain" alt="Vertical Ad" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, images: { ...formData.images, vertical: "" } })}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="aspect-[1/2] flex flex-col items-center justify-center text-gray-400 gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <span className="text-sm">Upload Vertical Ad</span>
                                </div>
                            )}

                            {!formData.images.vertical && (
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                    disabled={uploading}
                                    onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'vertical')}
                                />
                            )}
                        </div>
                    </div>

                    {/* Horizontal Image */}
                    <div className="space-y-4">
                        <Label className="flex justify-between">
                            <span>Horizontal Image (In-Content)</span>
                            <span className="text-xs text-gray-500 font-normal">Recommended: 728x90px</span>
                        </Label>

                        <div className={`relative border-2 border-dashed rounded-xl p-4 transition-colors ${formData.images.horizontal ? 'border-primary/20 bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                            {formData.images.horizontal ? (
                                <div className="relative aspect-[4/1] w-full bg-white rounded-lg overflow-hidden shadow-sm">
                                    <img src={formData.images.horizontal} className="w-full h-full object-contain" alt="Horizontal Ad" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, images: { ...formData.images, horizontal: "" } })}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="aspect-[4/1] flex flex-col items-center justify-center text-gray-400 gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <span className="text-sm">Upload Horizontal Ad</span>
                                </div>
                            )}

                            {!formData.images.horizontal && (
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                    disabled={uploading}
                                    onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'horizontal')}
                                />
                            )}
                        </div>
                    </div>

                </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-4 pb-2 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 z-10">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading || uploading} className="min-w-[120px]">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    {isEditing ? "Update Ad" : "Create Ad"}
                </Button>
            </div>

        </form>
    );
}

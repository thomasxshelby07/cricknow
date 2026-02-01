import { BlogFormData } from "@/types/blog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useState } from "react";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TabProps {
    data: BlogFormData;
    updateData: (updates: Partial<BlogFormData>) => void;
    updateNestedData?: (section: "seo" | "visibility", updates: any) => void;
}

export function ContentTab({ data, updateData }: TabProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input value={data.title} onChange={(e) => updateData({ title: e.target.value })} required />
                </div>
                <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input value={data.slug} onChange={(e) => updateData({ slug: e.target.value })} placeholder="auto-generated" />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Category</Label>
                <Select value={data.category} onValueChange={(val: any) => updateData({ category: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="guides">Betting Guide</SelectItem>
                        <SelectItem value="betting">General Betting</SelectItem>
                        <SelectItem value="casino">Casino Strategy</SelectItem>
                        <SelectItem value="cricket">Cricket News</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Content (Rich Text)</Label>
                <RichTextEditor value={data.content} onChange={(html) => updateData({ content: html })} />
            </div>



            <div className="space-y-2">
                <Label>Excerpt / Summary</Label>
                <Textarea value={data.excerpt} onChange={(e) => updateData({ excerpt: e.target.value })} />
            </div>
        </div>
    );
}
// Note: We can reuse SEOTab and VisibilityTab logic from the Sites module
// if we abstract them effectively, but for speed, I will use similar inline components
// or import if identical. Here I'll assume duplication for specific tweaking.

import { SearchableMultiSelect } from "@/components/admin/SearchableMultiSelect";

export function RelatedContentTab({ data, updateData }: TabProps) {
    return (
        <div className="space-y-6">
            {/* Related Betting Sites */}
            <div className="space-y-3">
                <Label>Related Betting Sites (Sidebar)</Label>
                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-sm text-gray-500 mb-3">
                        Select betting sites to display in the "Top Picks" sidebar widget.
                    </p>
                    <SearchableMultiSelect
                        placeholder="Search sites..."
                        endpoint="/api/admin/sites"
                        labelKey="name"
                        value={data.relatedSites || []}
                        onChange={(val) => updateData({ relatedSites: val })}
                    />
                </div>
            </div>

            {/* Related News */}
            <div className="space-y-3">
                <Label>Related News (Sidebar)</Label>
                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-sm text-gray-500 mb-3">
                        Select news articles to display in the "Latest News" sidebar widget.
                    </p>
                    <SearchableMultiSelect
                        placeholder="Search news..."
                        endpoint="/api/admin/news"
                        value={data.relatedNews || []}
                        onChange={(val) => updateData({ relatedNews: val })}
                    />
                </div>
            </div>

            {/* Related Blogs */}
            <div className="space-y-3">
                <Label>Related Blogs (Sidebar)</Label>
                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-sm text-gray-500 mb-3">
                        Select other blogs to display in the "Trending Stories" sidebar widget.
                    </p>
                    <SearchableMultiSelect
                        placeholder="Search blogs..."
                        endpoint="/api/admin/blogs"
                        value={data.relatedBlogs || []}
                        onChange={(val) => updateData({ relatedBlogs: val })}
                    />
                </div>
            </div>

            {/* Related Coupons */}
            <div className="space-y-3">
                <Label>Related Coupons (Sidebar)</Label>
                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-sm text-gray-500 mb-3">
                        Select coupons to display in the "Exclusive Bonuses" sidebar widget.
                    </p>
                    <SearchableMultiSelect
                        placeholder="Search coupons..."
                        endpoint="/api/admin/coupons"
                        labelKey="name"
                        value={data.relatedCoupons || []}
                        onChange={(val) => updateData({ relatedCoupons: val })}
                    />
                </div>
            </div>
        </div>
    );
}


export function MediaTab({ data, updateData }: TabProps) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (file: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            if (!res.ok) throw new Error("Upload failed");
            const json = await res.json();
            updateData({ coverImageUrl: json.url });
            toast.success("Image uploaded!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4 border p-4 rounded-lg">
            <Label>Cover Image</Label>
            <div className="flex items-center gap-4">
                {data.coverImageUrl ? (
                    <div className="relative w-48 h-28 border rounded-lg bg-gray-50 overflow-hidden">
                        <img src={data.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                        <button
                            onClick={() => updateData({ coverImageUrl: "" })}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ) : (
                    <div className="w-48 h-28 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 text-gray-400">
                        No Cover
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
                    <div className="text-xs text-gray-500 text-center uppercase font-bold my-2">- OR -</div>
                    <Input
                        placeholder="Enter Image URL manually"
                        value={data.coverImageUrl || ""}
                        onChange={(e) => updateData({ coverImageUrl: e.target.value })}
                    />
                </div>
            </div>
            {uploading && <div className="text-primary flex items-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> Uploading...</div>}
        </div>
    );
}

export function FAQTab({ data, updateData }: TabProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Label className="text-lg font-bold">Frequently Asked Questions</Label>
                    <p className="text-sm text-gray-500">Auto-injected as JSON-LD Schema.</p>
                </div>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                        updateData({ faqs: [...(data.faqs || []), { question: "New Question?", answer: "Answer here." }] });
                    }}
                >
                    <Plus className="w-4 h-4 mr-2" /> Add FAQ
                </Button>
            </div>
            <div className="space-y-4">
                {data.faqs?.map((faq, i) => (
                    <div key={i} className="flex gap-4 p-4 border rounded-lg bg-gray-50 items-start">
                        <div className="flex-1 space-y-2">
                            <Input
                                placeholder="Question"
                                value={faq.question}
                                onChange={(e) => {
                                    const newFaqs = [...(data.faqs || [])];
                                    newFaqs[i].question = e.target.value;
                                    updateData({ faqs: newFaqs });
                                }}
                                className="font-semibold"
                            />
                            <Textarea
                                placeholder="Answer"
                                value={faq.answer}
                                onChange={(e) => {
                                    const newFaqs = [...(data.faqs || [])];
                                    newFaqs[i].answer = e.target.value;
                                    updateData({ faqs: newFaqs });
                                }}
                            />
                        </div>
                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => {
                            updateData({ faqs: data.faqs?.filter((_, index: number) => index !== i) });
                        }}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

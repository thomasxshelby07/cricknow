"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { NewsFormData } from "@/types/news";

import { SearchableMultiSelect } from "@/components/admin/SearchableMultiSelect";

interface TabProps {
    data: NewsFormData;
    updateData: (updates: Partial<NewsFormData>) => void;
    updateNestedData: (section: "seo" | "visibility", updates: any) => void;
}

export function RelatedContentTab({ data, updateData }: TabProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-4 border p-4 rounded-lg">
                <div className="space-y-2">
                    <Label className="text-lg font-bold">Related Betting Sites</Label>
                    <p className="text-sm text-gray-500">Select specific betting sites to show on the sidebar for this news article.</p>
                    <SearchableMultiSelect
                        endpoint="/api/admin/sites"
                        value={data.relatedSites || []}
                        onChange={(val) => updateData({ relatedSites: val })}
                        placeholder="Select Betting Sites..."
                        labelKey="name"
                        valueKey="_id"
                    />
                </div>
            </div>

            <div className="space-y-4 border p-4 rounded-lg">
                <div className="space-y-2">
                    <Label className="text-lg font-bold">Related News</Label>
                    <p className="text-sm text-gray-500">Select specific news articles to recommend in the sidebar.</p>
                    <SearchableMultiSelect
                        endpoint="/api/admin/news"
                        value={data.relatedNews || []}
                        onChange={(val) => updateData({ relatedNews: val })}
                        placeholder="Select Related News..."
                        labelKey="title"
                        valueKey="_id"
                    />
                </div>
            </div>

            <div className="space-y-4 border p-4 rounded-lg">
                <div className="space-y-2">
                    <Label className="text-lg font-bold">Related Blogs</Label>
                    <p className="text-sm text-gray-500">Select specific blog posts to recommend in the sidebar.</p>
                    <SearchableMultiSelect
                        endpoint="/api/admin/blogs"
                        value={data.relatedBlogs || []}
                        onChange={(val) => updateData({ relatedBlogs: val })}
                        placeholder="Select Related Blogs..."
                        labelKey="title"
                        valueKey="_id"
                    />
                </div>
            </div>
        </div>
    );
}

export function BasicTab({ data, updateData }: TabProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>News Title</Label>
                    <Input value={data.title} onChange={(e) => updateData({ title: e.target.value })} placeholder="Enter news headline" />
                </div>
                <div className="space-y-2">
                    <Label>Slug (URL)</Label>
                    <Input value={data.slug} onChange={(e) => updateData({ slug: e.target.value })} placeholder="auto-generated-from-title" />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Summary (Short Description)</Label>
                <Textarea value={data.summary || ''} onChange={(e) => updateData({ summary: e.target.value })} placeholder="Brief summary for list view..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={data.category || 'General'} onValueChange={(val: any) => updateData({ category: val })}>
                        <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Cricket Betting">Cricket Betting</SelectItem>
                            <SelectItem value="Betting News">Betting News</SelectItem>
                            <SelectItem value="Casino News">Casino News</SelectItem>
                            <SelectItem value="Platform Updates">Platform Updates</SelectItem>
                            <SelectItem value="General">General</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Priority Order (Higher = First)</Label>
                    <Input type="number" value={data.priority || 0} onChange={(e) => updateData({ priority: parseInt(e.target.value) })} />
                </div>
            </div>

            <div className="space-y-4 border p-4 rounded-lg">
                <div className="flex items-center gap-2">
                    <Switch checked={data.isFeatured} onCheckedChange={(c) => updateData({ isFeatured: c })} />
                    <Label>Featured News (Pin to top/slider)</Label>
                </div>
            </div>
        </div>
    );
}

export function ContentTab({ data, updateData }: TabProps) {
    return (
        <div className="space-y-4">
            <Label className="text-lg font-bold">Main Content</Label>
            <RichTextEditor
                value={data.content || ''}
                onChange={(html) => updateData({ content: html })}
            />
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
                        value={data.coverImageUrl || ''}
                        onChange={(e) => updateData({ coverImageUrl: e.target.value })}
                    />
                </div>
            </div>
            {uploading && <div className="text-primary flex items-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> Uploading...</div>}
        </div>
    );
}

export function SEOTab({ data, updateNestedData, updateData }: TabProps) {
    return (
        <div className="space-y-4">
            {/* New H1 Control */}
            <div className="space-y-2 border-b pb-4">
                <Label>Custom H1 Title (Overrides News Title)</Label>
                <Input
                    value={data.customH1 || ''}
                    onChange={(e) => updateData({ customH1: e.target.value })}
                    placeholder="e.g. Breaking: India Wins World Cup!"
                />
            </div>

            <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input value={data.seo.metaTitle} onChange={(e) => updateNestedData("seo", { metaTitle: e.target.value })} />
                <p className="text-xs text-gray-500">Recommended: 50-60 Characters</p>
            </div>
            <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea value={data.seo.metaDescription} onChange={(e) => updateNestedData("seo", { metaDescription: e.target.value })} />
                <p className="text-xs text-gray-500">Recommended: 150-160 Characters</p>
            </div>

            {/* Content Freshness Signal */}
            <div className="space-y-2">
                <Label>Last Updated Date (Manual Override)</Label>
                <Input
                    type="date"
                    value={data.lastUpdated ? new Date(data.lastUpdated).toISOString().split('T')[0] : ''}
                    onChange={(e) => updateData({ lastUpdated: e.target.value })}
                />
                <p className="text-xs text-gray-400">If left empty, the system 'Updated At' timestamp will be used.</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Switch checked={data.seo.noIndex} onCheckedChange={(c) => updateNestedData("seo", { noIndex: c })} />
                    <Label>No Index</Label>
                </div>
                <div className="flex items-center gap-2">
                    <Switch checked={data.seo.noFollow} onCheckedChange={(c) => updateNestedData("seo", { noFollow: c })} />
                    <Label>No Follow</Label>
                </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
                <Label>Canonical URL</Label>
                <Input
                    value={data.seo.canonicalUrl || ''}
                    onChange={(e) => updateNestedData("seo", { canonicalUrl: e.target.value })}
                    placeholder="https://cricknow.com/news/some-news"
                />
            </div>

            <div className="space-y-2">
                <Label>Focus Keywords (Comma separated)</Label>
                <Input
                    value={data.seo.focusKeywords?.join(", ") || ''}
                    onChange={(e) => updateNestedData("seo", { focusKeywords: e.target.value.split(",").map(k => k.trim()) })}
                    placeholder="cricket, news, ipl"
                />
            </div>

            <div className="space-y-2">
                <Label>Custom Structured Data (JSON-LD)</Label>
                <Textarea
                    className="font-mono text-xs h-32"
                    value={data.seo.structuredData || ''}
                    onChange={(e) => updateNestedData("seo", { structuredData: e.target.value })}
                    placeholder='{ "@context": "https://schema.org", "@type": "NewsArticle", ... }'
                />
            </div>
        </div>
    );
}

export function FAQTab({ data, updateData }: TabProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Label className="text-lg font-bold">Frequently Asked Questions (FAQ)</Label>
                    <p className="text-sm text-gray-500">Auto-injected as JSON-LD.</p>
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
                            updateData({ faqs: data.faqs?.filter((_, index) => index !== i) });
                        }}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function InternalLinkingTab({ data, updateData }: TabProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Label className="text-lg font-bold">Internal Linking Strategy</Label>
                    <p className="text-sm text-gray-500">Link to related content.</p>
                </div>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                        updateData({
                            internalLinks: [...(data.internalLinks || []), { title: "", url: "", type: "other" }]
                        });
                    }}
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Link
                </Button>
            </div>

            <div className="space-y-3">
                {data.internalLinks?.map((link, i) => (
                    <div key={i} className="flex gap-4 items-center p-3 border rounded-lg bg-white shadow-sm">
                        <Select
                            value={link.type}
                            onValueChange={(val: any) => {
                                const newLinks = [...(data.internalLinks || [])];
                                newLinks[i].type = val;
                                updateData({ internalLinks: newLinks });
                            }}
                        >
                            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="blog">Related Blog</SelectItem>
                                <SelectItem value="news">News</SelectItem>
                                <SelectItem value="comparison">Comparison</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>

                        <Input
                            placeholder="Link Label"
                            value={link.title}
                            onChange={(e) => {
                                const newLinks = [...(data.internalLinks || [])];
                                newLinks[i].title = e.target.value;
                                updateData({ internalLinks: newLinks });
                            }}
                            className="flex-1"
                        />

                        <Input
                            placeholder="URL"
                            value={link.url}
                            onChange={(e) => {
                                const newLinks = [...(data.internalLinks || [])];
                                newLinks[i].url = e.target.value;
                                updateData({ internalLinks: newLinks });
                            }}
                            className="flex-1"
                        />

                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => {
                            updateData({ internalLinks: data.internalLinks?.filter((_, index) => index !== i) });
                        }}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function VisibilityTab({ data, updateData, updateNestedData }: TabProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Status</Label>
                <Select value={data.visibility.status} onValueChange={(val: any) => updateNestedData("visibility", { status: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="draft">Draft (Hidden)</SelectItem>
                        <SelectItem value="published">Published (Visible)</SelectItem>
                        <SelectItem value="hidden">Hidden</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-2">
                <Switch checked={data.visibility.showOnHome} onCheckedChange={(c) => updateNestedData("visibility", { showOnHome: c })} />
                <Label>Show on Home Page</Label>
            </div>
        </div>
    );
}

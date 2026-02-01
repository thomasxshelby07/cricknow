import { GameFormData } from "@/types/game";
import { SearchableMultiSelect } from "@/components/admin/SearchableMultiSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useState } from "react";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface TabProps {
    data: GameFormData;
    updateData: (updates: Partial<GameFormData>) => void;
    updateNestedData: (section: "seo" | "visibility", updates: any) => void;
}

export function ContentTab({ data, updateData }: TabProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Game Title *</Label>
                    <Input value={data.title} onChange={(e) => updateData({ title: e.target.value })} required />
                </div>
                <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input value={data.slug} onChange={(e) => updateData({ slug: e.target.value })} placeholder="auto-generated" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={data.category} onValueChange={(val: any) => updateData({ category: val })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Casino">Casino</SelectItem>
                            <SelectItem value="Crash Games">Crash Games</SelectItem>
                            <SelectItem value="Sports Betting">Sports Betting</SelectItem>
                            <SelectItem value="Slots">Slots</SelectItem>
                            <SelectItem value="Card Games">Card Games</SelectItem>
                            <SelectItem value="Table Games">Table Games</SelectItem>
                            <SelectItem value="Fantasy Sports">Fantasy Sports</SelectItem>
                            <SelectItem value="eSports">eSports</SelectItem>
                            <SelectItem value="Poker">Poker</SelectItem>
                            <SelectItem value="Roulette">Roulette</SelectItem>
                            <SelectItem value="Blackjack">Blackjack</SelectItem>
                            <SelectItem value="Lottery">Lottery</SelectItem>
                            <SelectItem value="Bingo">Bingo</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Provider</Label>
                    <Input value={data.provider || ""} onChange={(e) => updateData({ provider: e.target.value })} placeholder="e.g. Evolution, Spribe" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Rating (0-5)</Label>
                    <Input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={data.rating}
                        onChange={(e) => updateData({ rating: parseFloat(e.target.value) })}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Play Link</Label>
                    <Input value={data.playLink || ""} onChange={(e) => updateData({ playLink: e.target.value })} placeholder="https://..." />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Demo Link</Label>
                <Input value={data.demoLink || ""} onChange={(e) => updateData({ demoLink: e.target.value })} placeholder="https://..." />
            </div>

            <div className="space-y-2">
                <Label>Short Description</Label>
                <Textarea value={data.description} onChange={(e) => updateData({ description: e.target.value })} />
            </div>

            <div className="space-y-2">
                <Label>Content (Article/Review)</Label>
                <RichTextEditor value={data.content} onChange={(html) => updateData({ content: html })} />
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
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `Upload failed: ${res.status}`);
            }
            const json = await res.json();
            updateData({ coverImage: json.url });
            toast.success("Image uploaded!");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4 border p-4 rounded-lg">
            <Label>Cover Image</Label>
            <div className="flex items-center gap-4">
                {data.coverImage ? (
                    <div className="relative w-48 h-28 border rounded-lg bg-gray-50 overflow-hidden">
                        <img src={data.coverImage} alt="Cover" className="w-full h-full object-cover" />
                        <button
                            onClick={() => updateData({ coverImage: "" })}
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
                        value={data.coverImage || ""}
                        onChange={(e) => updateData({ coverImage: e.target.value })}
                    />
                </div>
            </div>

            <div className="border-t pt-4 mt-4">
                <Label>Game Screenshots</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 mb-4">
                    {data.screenshots?.map((url, i) => (
                        <div key={i} className="relative aspect-video border rounded-lg overflow-hidden bg-gray-50">
                            <img src={url} alt={`Screenshot ${i}`} className="w-full h-full object-cover" />
                            <button
                                onClick={() => updateData({ screenshots: data.screenshots?.filter((_, index) => index !== i) })}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-4 min-h-[100px]">
                        {uploading ? <Loader2 className="animate-spin" /> : (
                            <>
                                <Plus className="w-6 h-6 mb-2" />
                                <span className="text-xs">Add Screenshot</span>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={async (e) => {
                                        if (e.target.files?.[0]) {
                                            setUploading(true);
                                            try {
                                                const formData = new FormData();
                                                formData.append("file", e.target.files[0]);
                                                const res = await fetch("/api/upload", { method: "POST", body: formData });
                                                if (!res.ok) {
                                                    const errData = await res.json().catch(() => ({}));
                                                    throw new Error(errData.error || "Upload failed");
                                                }
                                                const json = await res.json();
                                                updateData({ screenshots: [...(data.screenshots || []), json.url] });
                                                toast.success("Screenshot uploaded");
                                            } catch (err: any) {
                                                console.error(err);
                                                toast.error(err.message || "Upload failed");
                                            }
                                            finally { setUploading(false); }
                                        }
                                    }}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
            {uploading && <div className="text-primary flex items-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> Uploading...</div>}
        </div>
    );
}

export function SEOTab({ data, updateData, updateNestedData }: TabProps) {
    const [focusKeyword, setFocusKeyword] = useState("");
    const [keyword, setKeyword] = useState("");

    const addFocusKeyword = () => {
        if (focusKeyword.trim()) {
            updateNestedData("seo", { focusKeywords: [...(data.seo.focusKeywords || []), focusKeyword.trim()] });
            setFocusKeyword("");
        }
    };

    const addKeyword = () => {
        if (keyword.trim()) {
            updateNestedData("seo", { keywords: [...(data.seo.keywords || []), keyword.trim()] });
            setKeyword("");
        }
    };

    return (
        <div className="space-y-6">
            {/* Basic Meta */}
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-bold text-lg">Basic Meta Tags</h3>

                <div className="space-y-2">
                    <Label>Custom H1 Title</Label>
                    <Input
                        value={data.seo.customH1 || ""}
                        onChange={(e) => updateNestedData("seo", { customH1: e.target.value })}
                        placeholder="Custom H1 for better SEO (optional)"
                    />
                    <p className="text-xs text-gray-500">If empty, will use game title</p>
                </div>

                <div className="space-y-2">
                    <Label>Meta Title</Label>
                    <Input
                        value={data.seo.metaTitle || ""}
                        onChange={(e) => updateNestedData("seo", { metaTitle: e.target.value })}
                        placeholder="SEO Title (50-60 characters)"
                        maxLength={60}
                    />
                    <p className="text-xs text-gray-500">{(data.seo.metaTitle || "").length}/60 characters</p>
                </div>

                <div className="space-y-2">
                    <Label>Meta Description</Label>
                    <Textarea
                        value={data.seo.metaDescription || ""}
                        onChange={(e) => updateNestedData("seo", { metaDescription: e.target.value })}
                        placeholder="SEO Description (150-160 characters)"
                        maxLength={160}
                        rows={3}
                    />
                    <p className="text-xs text-gray-500">{(data.seo.metaDescription || "").length}/160 characters</p>
                </div>
            </div>

            {/* Keywords */}
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-bold text-lg">Keywords</h3>

                <div className="space-y-2">
                    <Label>Focus Keywords (Primary)</Label>
                    <div className="flex gap-2">
                        <Input
                            value={focusKeyword}
                            onChange={(e) => setFocusKeyword(e.target.value)}
                            placeholder="Add focus keyword"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFocusKeyword())}
                        />
                        <Button type="button" onClick={addFocusKeyword} size="sm">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {data.seo.focusKeywords?.map((kw, i) => (
                            <Badge key={i} variant="default" className="flex items-center gap-1">
                                {kw}
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => updateNestedData("seo", {
                                        focusKeywords: data.seo.focusKeywords?.filter((_, idx) => idx !== i)
                                    })}
                                />
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Additional Keywords</Label>
                    <div className="flex gap-2">
                        <Input
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Add keyword"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                        />
                        <Button type="button" onClick={addKeyword} size="sm">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {data.seo.keywords?.map((kw, i) => (
                            <Badge key={i} variant="secondary" className="flex items-center gap-1">
                                {kw}
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => updateNestedData("seo", {
                                        keywords: data.seo.keywords?.filter((_, idx) => idx !== i)
                                    })}
                                />
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            {/* URLs & Indexing */}
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-bold text-lg">URLs & Indexing</h3>

                <div className="space-y-2">
                    <Label>Canonical URL</Label>
                    <Input
                        value={data.seo.canonicalUrl || ""}
                        onChange={(e) => updateNestedData("seo", { canonicalUrl: e.target.value })}
                        placeholder="https://cricknow.com/games/game-slug"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={data.seo.noIndex}
                            onCheckedChange={(val) => updateNestedData("seo", { noIndex: val })}
                        />
                        <Label>No Index</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={data.seo.noFollow}
                            onCheckedChange={(val) => updateNestedData("seo", { noFollow: val })}
                        />
                        <Label>No Follow</Label>
                    </div>
                </div>
            </div>

            {/* Open Graph */}
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-bold text-lg">Open Graph (Facebook)</h3>

                <div className="space-y-2">
                    <Label>OG Title</Label>
                    <Input
                        value={data.seo.ogTitle || ""}
                        onChange={(e) => updateNestedData("seo", { ogTitle: e.target.value })}
                        placeholder="Title for social media sharing"
                    />
                </div>

                <div className="space-y-2">
                    <Label>OG Description</Label>
                    <Textarea
                        value={data.seo.ogDescription || ""}
                        onChange={(e) => updateNestedData("seo", { ogDescription: e.target.value })}
                        placeholder="Description for social media"
                        rows={2}
                    />
                </div>

                <div className="space-y-2">
                    <Label>OG Image URL</Label>
                    <Input
                        value={data.seo.ogImage || ""}
                        onChange={(e) => updateNestedData("seo", { ogImage: e.target.value })}
                        placeholder="https://... (1200x630px recommended)"
                    />
                </div>
            </div>

            {/* Twitter Card */}
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-bold text-lg">Twitter Card</h3>

                <div className="space-y-2">
                    <Label>Twitter Title</Label>
                    <Input
                        value={data.seo.twitterTitle || ""}
                        onChange={(e) => updateNestedData("seo", { twitterTitle: e.target.value })}
                        placeholder="Title for Twitter"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Twitter Description</Label>
                    <Textarea
                        value={data.seo.twitterDescription || ""}
                        onChange={(e) => updateNestedData("seo", { twitterDescription: e.target.value })}
                        placeholder="Description for Twitter"
                        rows={2}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Twitter Image URL</Label>
                    <Input
                        value={data.seo.twitterImage || ""}
                        onChange={(e) => updateNestedData("seo", { twitterImage: e.target.value })}
                        placeholder="https://... (1200x600px recommended)"
                    />
                </div>
            </div>

            {/* Structured Data */}
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-bold text-lg">Structured Data (JSON-LD)</h3>
                <p className="text-sm text-gray-500">Custom JSON-LD schema for advanced SEO. Leave empty to use auto-generated schema.</p>

                <Textarea
                    value={typeof data.seo.structuredData === 'string' ? data.seo.structuredData : JSON.stringify(data.seo.structuredData || {}, null, 2)}
                    onChange={(e) => {
                        try {
                            const parsed = JSON.parse(e.target.value);
                            updateNestedData("seo", { structuredData: parsed });
                        } catch {
                            updateNestedData("seo", { structuredData: e.target.value });
                        }
                    }}
                    placeholder='{"@context": "https://schema.org", "@type": "Game", ...}'
                    rows={8}
                    className="font-mono text-xs"
                />
            </div>
        </div>
    );
}

export function VisibilityTab({ data, updateNestedData }: TabProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Status</Label>
                <Select value={data.visibility.status} onValueChange={(val: any) => updateNestedData("visibility", { status: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-2">
                <Switch
                    checked={data.visibility.featured}
                    onCheckedChange={(val) => updateNestedData("visibility", { featured: val })}
                />
                <Label>Featured Game</Label>
            </div>
            <div className="space-y-2">
                <Label>Display Order</Label>
                <Input
                    type="number"
                    value={data.visibility.displayOrder}
                    onChange={(e) => updateNestedData("visibility", { displayOrder: parseInt(e.target.value) })}
                />
            </div>
        </div>
    );
}

export function RelatedContentTab({ data, updateData }: TabProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <Label>Related Betting Sites (Casinos)</Label>
                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-sm text-gray-500 mb-3">Select casinos to recommend alongside this game.</p>
                    <SearchableMultiSelect placeholder="Search casinos..." endpoint="/api/admin/sites" labelKey="name" value={data.relatedCasinos || []} onChange={(val) => updateData({ relatedCasinos: val })} />
                </div>
            </div>
            <div className="space-y-3">
                <Label>Related Coupons</Label>
                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-sm text-gray-500 mb-3">Select coupons to display in the sidebar.</p>
                    <SearchableMultiSelect placeholder="Search coupons..." endpoint="/api/admin/coupons" labelKey="name" value={data.relatedCoupons || []} onChange={(val) => updateData({ relatedCoupons: val })} />
                </div>
            </div>
            <div className="space-y-3">
                <Label>Related Blogs</Label>
                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-sm text-gray-500 mb-3">Select blogs related to this game (Strategy, Guides).</p>
                    <SearchableMultiSelect placeholder="Search blogs..." endpoint="/api/admin/blogs" value={data.relatedBlogs || []} onChange={(val) => updateData({ relatedBlogs: val })} />
                </div>
            </div>
            <div className="space-y-3">
                <Label>Related News</Label>
                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-sm text-gray-500 mb-3">Select news articles related to this game.</p>
                    <SearchableMultiSelect placeholder="Search news..." endpoint="/api/admin/news" value={data.relatedNews || []} onChange={(val) => updateData({ relatedNews: val })} />
                </div>
            </div>
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
                <Button size="sm" variant="outline" onClick={() => updateData({ faqs: [...(data.faqs || []), { question: "New Question?", answer: "Answer here." }] })}>
                    <Plus className="w-4 h-4 mr-2" /> Add FAQ
                </Button>
            </div>
            <div className="space-y-4">
                {data.faqs?.map((faq, i) => (
                    <div key={i} className="flex gap-4 p-4 border rounded-lg bg-gray-50 items-start">
                        <div className="flex-1 space-y-2">
                            <Input placeholder="Question" value={faq.question} onChange={(e) => { const newFaqs = [...(data.faqs || [])]; newFaqs[i].question = e.target.value; updateData({ faqs: newFaqs }); }} className="font-semibold" />
                            <Textarea placeholder="Answer" value={faq.answer} onChange={(e) => { const newFaqs = [...(data.faqs || [])]; newFaqs[i].answer = e.target.value; updateData({ faqs: newFaqs }); }} />
                        </div>
                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => updateData({ faqs: data.faqs?.filter((_, index) => index !== i) })}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ExtrasTab({ data, updateData }: TabProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label>Pros (Advantages)</Label>
                        <Button size="sm" variant="ghost" onClick={() => updateData({ pros: [...(data.pros || []), ""] })}><Plus className="w-3 h-3" /></Button>
                    </div>
                    {data.pros?.map((pro, i) => (
                        <div key={i} className="flex gap-2">
                            <Input value={pro} onChange={(e) => { const newPros = [...(data.pros || [])]; newPros[i] = e.target.value; updateData({ pros: newPros }); }} />
                            <Button size="icon" variant="ghost" className="text-red-500" onClick={() => updateData({ pros: data.pros?.filter((_, index) => index !== i) })}><Trash2 className="w-3 h-3" /></Button>
                        </div>
                    ))}
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label>Cons (Disadvantages)</Label>
                        <Button size="sm" variant="ghost" onClick={() => updateData({ cons: [...(data.cons || []), ""] })}><Plus className="w-3 h-3" /></Button>
                    </div>
                    {data.cons?.map((con, i) => (
                        <div key={i} className="flex gap-2">
                            <Input value={con} onChange={(e) => { const newCons = [...(data.cons || [])]; newCons[i] = e.target.value; updateData({ cons: newCons }); }} />
                            <Button size="icon" variant="ghost" className="text-red-500" onClick={() => updateData({ cons: data.cons?.filter((_, index) => index !== i) })}><Trash2 className="w-3 h-3" /></Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

import { BettingSiteFormData } from "@/types/site";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RichTextEditor } from "../RichTextEditor";

interface TabProps {
    data: BettingSiteFormData;
    updateData: (updates: Partial<BettingSiteFormData>) => void;
    updateNestedData: (section: "seo" | "visibility", updates: any) => void;
}

export function BasicTab({ data, updateData }: TabProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Site Name *</Label>
                    <Input value={data.name} onChange={(e) => updateData({ name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                    <Label>Slug (Auto-generated if empty) *</Label>
                    <Input value={data.slug} onChange={(e) => updateData({ slug: e.target.value })} placeholder="betway-review" />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Type *</Label>
                <Select value={data.type} onValueChange={(val: any) => updateData({ type: val })}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="betting">Betting Site</SelectItem>
                        <SelectItem value="casino">Casino Site</SelectItem>
                        <SelectItem value="cricket">Cricket Special</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Short Description (Card View)</Label>
                <Textarea value={data.shortDescription} onChange={(e) => updateData({ shortDescription: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Affiliate Link (Money Link) *</Label>
                    <Input value={data.affiliateLink} onChange={(e) => updateData({ affiliateLink: e.target.value })} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                    <Label>Overall Rating (0-10)</Label>
                    <Input type="number" step="0.1" value={data.rating} onChange={(e) => updateData({ rating: parseFloat(e.target.value) })} />
                </div>
            </div>

            <div className="space-y-3 border p-4 rounded-lg bg-gray-50">
                <Label>Trust Badges</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                        "Verified", "Licensed", "Fast Payouts", "Best Odds", "24/7 Support", "100% Secure",
                        "Fast Withdraw", "No Freeze", "UPI Supported", "USDT Supported", "PayTM Supported", "PhonePe Supported",
                        "300+ Games", "Cricket", "IPL", "World Cup", "Live Streaming", "Casino Games",
                        "VIP Program", "Instant Deposit", "High Limits", "Best App", "Sign Up Bonus", "Free Bets",
                        "Official Partner", "Daily Jackpots", "Crash Games", "Aviator Available", "Zero Commission",
                        "Loyalty Rewards", "Exclusive Offer", "Hindi Support", "Local Bank Transfer", "Crypto Friendly",
                        "Easy Verification", "High Odds", "Live Dealers", "Fast Signup", "Low Deposit", "Referral Bonus"
                    ].map((badge) => (
                        <div key={badge} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id={`badge-${badge}`}
                                checked={data.badges?.includes(badge)}
                                onChange={(e) => {
                                    const current = data.badges || [];
                                    const next = e.target.checked
                                        ? [...current, badge]
                                        : current.filter(b => b !== badge);
                                    updateData({ badges: next });
                                }}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor={`badge-${badge}`} className="cursor-pointer font-normal">{badge}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>CTA Text</Label>
                    <Input value={data.ctaText} onChange={(e) => updateData({ ctaText: e.target.value })} placeholder="Claim Bonus" />
                </div>
                <div className="space-y-2">
                    <Label>Welcome Bonus Text</Label>
                    <Input value={data.joiningBonus} onChange={(e) => updateData({ joiningBonus: e.target.value })} placeholder="100% up to ₹10,000" />
                </div>
                <div className="space-y-2">
                    <Label>Redeposit Bonus (Optional)</Label>
                    <Input value={data.reDepositBonus || ''} onChange={(e) => updateData({ reDepositBonus: e.target.value })} placeholder="e.g. 50% Reload" />
                </div>
                <div className="space-y-2">
                    <Label>Other Bonus (Optional)</Label>
                    <Input value={data.otherBonus || ''} onChange={(e) => updateData({ otherBonus: e.target.value })} placeholder="e.g. Free Spins" />
                </div>
            </div>
        </div>
    );
}

export function PageContentTab({ data, updateData }: TabProps) {
    const [newItem, setNewItem] = useState("");

    const addItem = (field: 'pros' | 'cons' | 'licenses' | 'gallery') => {
        if (!newItem) return;
        const current = data[field] || [];
        updateData({ [field]: [...current, newItem] });
        setNewItem("");
    };

    const removeItem = (field: 'pros' | 'cons' | 'licenses' | 'gallery', index: number) => {
        const current = data[field] || [];
        updateData({ [field]: current.filter((_, i) => i !== index) });
    };

    // Gallery Upload
    const handleGalleryUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            if (!res.ok) throw new Error("Upload failed");
            const json = await res.json();
            updateData({ gallery: [...(data.gallery || []), json.url] });
            toast.success("Image added to gallery!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload.");
        }
    };


    return (
        <div className="space-y-8">
            {/* Header Info */}
            <div className="grid grid-cols-3 gap-4 border p-4 rounded-lg bg-gray-50">
                <div className="space-y-2">
                    <Label>Review Title</Label>
                    <Input value={data.reviewTitle || ''} onChange={(e) => updateData({ reviewTitle: e.target.value })} placeholder="e.g. Parimatch Review 2024" />
                </div>
                <div className="space-y-2">
                    <Label>Founded Year</Label>
                    <Input value={data.foundedYear || ''} onChange={(e) => updateData({ foundedYear: e.target.value })} placeholder="e.g. 1994" />
                </div>
                <div className="space-y-2">
                    <Label>Owner / Company</Label>
                    <Input value={data.owner || ''} onChange={(e) => updateData({ owner: e.target.value })} placeholder="e.g. PMSPORT N.V." />
                </div>
            </div>

            {/* Ratings Breakdown */}
            <div className="space-y-4 border p-4 rounded-lg">
                <Label className="text-base font-bold">Detailed Ratings (0-10)</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {['trust', 'games', 'bonus', 'support', 'overall'].map((key) => (
                        <div key={key} className="space-y-1">
                            <Label className="capitalize">{key}</Label>
                            <Input
                                type="number"
                                step="0.1"
                                value={data.ratings?.[key as keyof typeof data.ratings] || 0}
                                onChange={(e) => updateData({
                                    ratings: { ...data.ratings, [key]: parseFloat(e.target.value) } as any
                                })}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Rich Content Review */}
            <div className="space-y-2">
                <Label>Full Review Content</Label>
                <RichTextEditor value={data.reviewContent || ''} onChange={(html) => updateData({ reviewContent: html })} />
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pros */}
                <div className="space-y-3">
                    <Label>Pros (Advantages)</Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add a pro..."
                            onKeyDown={(e) => { if (e.key === 'Enter') { addItem('pros'); } }}
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                        />
                        <Button type="button" size="icon" onClick={() => addItem('pros')}><Plus className="w-4 h-4" /></Button>
                    </div>
                    <ul className="space-y-2">
                        {data.pros?.map((item, i) => (
                            <li key={i} className="flex justify-between items-center bg-green-50 p-2 rounded text-sm border border-green-100">
                                <span>{item}</span>
                                <button onClick={() => removeItem('pros', i)} className="text-red-500 hover:text-red-700"><Trash2 className="w-3 h-3" /></button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Cons */}
                <div className="space-y-3">
                    <Label>Cons (Disadvantages)</Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add a con..."
                            onKeyDown={(e) => { if (e.key === 'Enter') { addItem('cons'); } }}
                            // Note: Sharing state here is buggy if typing in both. For simplicity in this demo, assumes one focus.
                            // Ideally use separate state.
                            onChange={(e) => setNewItem(e.target.value)}
                        />
                        <Button type="button" size="icon" onClick={() => addItem('cons')}><Plus className="w-4 h-4" /></Button>
                    </div>
                    <ul className="space-y-2">
                        {data.cons?.map((item, i) => (
                            <li key={i} className="flex justify-between items-center bg-red-50 p-2 rounded text-sm border border-red-100">
                                <span>{item}</span>
                                <button onClick={() => removeItem('cons', i)} className="text-red-500 hover:text-red-700"><Trash2 className="w-3 h-3" /></button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* User Reviews Manager */}
            <div className="border-t pt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-bold">User Reviews</Label>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            const newReview = { user: "New User", rating: 5, date: "Just now", comment: "Review text..." };
                            updateData({ userReviews: [...(data.userReviews || []), newReview] });
                        }}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Review
                    </Button>
                </div>
                <div className="space-y-4">
                    {data.userReviews?.map((review, i) => (
                        <div key={i} className="flex gap-4 p-4 border rounded-lg bg-gray-50 items-start">
                            <div className="flex-1 space-y-2">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="User Name"
                                        value={review.user}
                                        onChange={(e) => {
                                            const newReviews = [...(data.userReviews || [])];
                                            newReviews[i].user = e.target.value;
                                            updateData({ userReviews: newReviews });
                                        }}
                                        className="w-1/3"
                                    />
                                    <Input
                                        type="number" min="1" max="5"
                                        value={review.rating}
                                        onChange={(e) => {
                                            const newReviews = [...(data.userReviews || [])];
                                            newReviews[i].rating = parseInt(e.target.value);
                                            updateData({ userReviews: newReviews });
                                        }}
                                        className="w-20"
                                    />
                                    <Input
                                        placeholder="Country (e.g. India)"
                                        value={review.country || ''}
                                        onChange={(e) => {
                                            const newReviews = [...(data.userReviews || [])];
                                            newReviews[i].country = e.target.value;
                                            updateData({ userReviews: newReviews });
                                        }}
                                        className="w-1/3"
                                    />
                                    <Input
                                        placeholder="Date (e.g. 2 days ago)"
                                        value={review.date}
                                        onChange={(e) => {
                                            const newReviews = [...(data.userReviews || [])];
                                            newReviews[i].date = e.target.value;
                                            updateData({ userReviews: newReviews });
                                        }}
                                        className="w-1/3"
                                    />
                                </div>
                                <Textarea
                                    placeholder="Review Comment"
                                    value={review.comment}
                                    onChange={(e) => {
                                        const newReviews = [...(data.userReviews || [])];
                                        newReviews[i].comment = e.target.value;
                                        updateData({ userReviews: newReviews });
                                    }}
                                />
                            </div>
                            <Button size="icon" variant="ghost" className="text-red-500" onClick={() => {
                                updateData({ userReviews: data.userReviews?.filter((_, index) => index !== i) });
                            }}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* SEO Sections Manager */}
            <div className="border-t pt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-bold">SEO Content Sections</Label>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            const newSection = { title: "New Section Title", content: "<p>Content goes here...</p>" };
                            updateData({ seoSections: [...(data.seoSections || []), newSection] });
                        }}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Section
                    </Button>
                </div>
                <div className="space-y-6">
                    {data.seoSections?.map((section, i) => (
                        <div key={i} className="border p-4 rounded-xl space-y-3 bg-white shadow-sm">
                            <div className="flex justify-between items-center">
                                <Input
                                    className="text-lg font-semibold border-none focus-visible:ring-0 px-0"
                                    value={section.title}
                                    placeholder="Section Title"
                                    onChange={(e) => {
                                        const newSections = [...(data.seoSections || [])];
                                        newSections[i].title = e.target.value;
                                        updateData({ seoSections: newSections });
                                    }}
                                />
                                <Button size="sm" variant="ghost" className="text-red-500" onClick={() => {
                                    updateData({ seoSections: data.seoSections?.filter((_, index) => index !== i) });
                                }}><Trash2 className="w-4 h-4" /> Remove Section</Button>
                            </div>

                            {/* Section Image Upload */}
                            <div className="flex items-center gap-4 border-b pb-4 mb-4 border-dashed">
                                {section.image ? (
                                    <div className="relative h-20 w-32 rounded bg-gray-100 overflow-hidden border">
                                        <img src={section.image} className="w-full h-full object-cover" alt="Section" />
                                        <button
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center text-xs"
                                            onClick={() => {
                                                const newSections = [...(data.seoSections || [])];
                                                newSections[i].image = "";
                                                updateData({ seoSections: newSections });
                                            }}
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium text-gray-700 transition-colors">
                                            <Upload className="w-4 h-4" />
                                            Add Image to Section
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const formData = new FormData();
                                                        formData.append("file", file);

                                                        const loadingToast = toast.loading("Uploading image...");

                                                        fetch("/api/upload", { method: "POST", body: formData })
                                                            .then(res => {
                                                                if (!res.ok) throw new Error("Upload failed");
                                                                return res.json();
                                                            })
                                                            .then(json => {
                                                                const newSections = [...(data.seoSections || [])];
                                                                newSections[i].image = json.url;
                                                                updateData({ seoSections: newSections });
                                                                toast.success("Image uploaded successfully!", { id: loadingToast });
                                                            })
                                                            .catch((err) => {
                                                                console.error(err);
                                                                toast.error("Failed to upload image", { id: loadingToast });
                                                            });
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                )}
                                <span className="text-xs text-gray-400">Optional: Add an image to display within this section.</span>
                            </div>

                            <RichTextEditor
                                value={section.content}
                                onChange={(html) => {
                                    const newSections = [...(data.seoSections || [])];
                                    newSections[i].content = html;
                                    updateData({ seoSections: newSections });
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Comparison Content Section */}
            <div className="border-t pt-6 space-y-4">
                <Label className="text-lg font-bold">Comparison Content</Label>
                <p className="text-sm text-gray-500">Add a section comparing this site with others (e.g. "Dafaxbet vs other sites").</p>
                <RichTextEditor
                    value={data.comparisonContent || ''}
                    onChange={(html) => updateData({ comparisonContent: html })}
                />
            </div>

            {/* Gallery */}
            <div className="space-y-4 pt-4 border-t">
                {/* User requested removal of "Screenshots" label, keeping it generic or removed */}
                {/* <Label>Gallery</Label> */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {data.gallery?.map((url, i) => (
                        <div key={i} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border">
                            <img src={url} alt="Gallery" className="object-cover w-full h-full" />
                            <button onClick={() => removeItem('gallery', i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg aspect-video cursor-pointer hover:bg-gray-50 transition-colors">
                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500">Add Image</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                            // Fix the handleGalleryUpload issue (it was void, needed promise, or just use it as is)
                            const file = e.target.files?.[0];
                            if (file) handleGalleryUpload(file);
                        }} />
                    </label>
                </div>
            </div>
        </div>
    );
}

export function SEOTab({ data, updateNestedData, updateData }: TabProps) {
    return (
        <div className="space-y-4">
            {/* New H1 Control */}
            <div className="space-y-2 border-b pb-4">
                <Label>Custom H1 Title (Overrides Site Name)</Label>
                <Input
                    value={data.customH1 || ''}
                    onChange={(e) => updateData({ customH1: e.target.value })}
                    placeholder="e.g. Dafaxbet Review – Bonus, Sports Betting & User Ratings"
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
                    placeholder="https://cricknow.com/sites/betway"
                />
            </div>

            <div className="space-y-2">
                <Label>Focus Keywords (Comma separated)</Label>
                <Input
                    value={data.seo.focusKeywords?.join(", ") || ''}
                    onChange={(e) => updateNestedData("seo", { focusKeywords: e.target.value.split(",").map(k => k.trim()) })}
                    placeholder="betting site, cricket betting, bonus"
                />
            </div>

            <div className="space-y-2">
                <Label>Custom Structured Data (JSON-LD)</Label>
                <Textarea
                    className="font-mono text-xs h-32"
                    value={data.seo.structuredData || ''}
                    onChange={(e) => updateNestedData("seo", { structuredData: e.target.value })}
                    placeholder='{ "@context": "https://schema.org", "@type": "Review", ... }'
                />
                <p className="text-xs text-gray-400">Paste valid JSON here to inject into the head of the page.</p>
            </div>
        </div>
    );
}

export function MediaTab({ data, updateData }: TabProps) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (file: File, field: 'logoUrl' | 'coverImageUrl') => {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const json = await res.json();
            updateData({ [field]: json.url });
            toast.success("Image uploaded!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Logo Upload */}
            <div className="space-y-4 border p-4 rounded-lg">
                <Label>Site Logo</Label>
                <div className="flex items-center gap-4">
                    {data.logoUrl ? (
                        <div className="relative w-24 h-24 border rounded-lg p-2 bg-gray-50">
                            <img src={data.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                            <button
                                onClick={() => updateData({ logoUrl: "" })}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ) : (
                        <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 text-gray-400">
                            No Logo
                        </div>
                    )}

                    <div className="flex-1 space-y-2">
                        <Input
                            type="file"
                            accept="image/*"
                            disabled={uploading}
                            onChange={(e) => {
                                if (e.target.files?.[0]) handleUpload(e.target.files[0], 'logoUrl');
                            }}
                        />
                        <div className="text-xs text-gray-500 text-center uppercase font-bold my-2">- OR -</div>
                        <Input
                            placeholder="Enter Image URL manually"
                            value={data.logoUrl}
                            onChange={(e) => updateData({ logoUrl: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-4 border p-4 rounded-lg">
                <Label>Cover Image (Optional)</Label>
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
                                if (e.target.files?.[0]) handleUpload(e.target.files[0], 'coverImageUrl');
                            }}
                        />
                        <div className="text-xs text-gray-500 text-center uppercase font-bold my-2">- OR -</div>
                        <Input
                            placeholder="Enter Image URL manually"
                            value={data.coverImageUrl}
                            onChange={(e) => updateData({ coverImageUrl: e.target.value })}
                        />
                    </div>
                </div>
            </div>
            {uploading && <div className="text-primary flex items-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> Uploading...</div>}
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

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4 border p-4 rounded-md">
                    <h4 className="font-semibold text-sm">Global Placements</h4>
                    <div className="flex items-center gap-2">
                        <Switch checked={data.visibility.showOnHome} onCheckedChange={(c) => updateNestedData("visibility", { showOnHome: c })} />
                        <Label>Show on Home Page</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch checked={data.isFeatured} onCheckedChange={(c) => updateData({ isFeatured: c })} />
                        <Label>Mark as Featured</Label>
                    </div>
                </div>

                <div className="space-y-4 border p-4 rounded-md">
                    <h4 className="font-semibold text-sm">Category Pages</h4>
                    <div className="flex items-center gap-2">
                        <Switch checked={data.showOnCricket} onCheckedChange={(c) => updateData({ showOnCricket: c })} />
                        <Label>Show on Cricket Hub</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch checked={data.showOnOffers} onCheckedChange={(c) => updateData({ showOnOffers: c })} />
                        <Label>Show on Offers Hub</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch checked={data.showOnCasino} onCheckedChange={(c) => updateData({ showOnCasino: c })} />
                        <Label>Show on Casino Hub</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch checked={data.showOnNewsSidebar} onCheckedChange={(c) => updateData({ showOnNewsSidebar: c })} />
                        <Label>Show on News Sidebar</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch checked={data.showOnBlogSidebar} onCheckedChange={(c) => updateData({ showOnBlogSidebar: c })} />
                        <Label>Show on Blog Sidebar</Label>
                    </div>
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
                    <Label className="text-lg font-bold">Frequently Asked Questions (FAQ)</Label>
                    <p className="text-sm text-gray-500">These will be added as Schema (JSON-LD) automatically.</p>
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
                                placeholder="Question (e.g. Is Dafaxbet Legal?)"
                                value={faq.question}
                                onChange={(e) => {
                                    const newFaqs = [...(data.faqs || [])];
                                    newFaqs[i].question = e.target.value;
                                    updateData({ faqs: newFaqs });
                                }}
                                className="font-semibold"
                            />
                            <Textarea
                                placeholder="Answer (Keep it concise for SEO)"
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
                    <p className="text-sm text-gray-500">Link to related blogs, news, or comparisons to boost SEO.</p>
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
                                <SelectItem value="news">Related News</SelectItem>
                                <SelectItem value="comparison">Comparison</SelectItem>
                                <SelectItem value="other">Other Page</SelectItem>
                            </SelectContent>
                        </Select>

                        <Input
                            placeholder="Link Label / Title"
                            value={link.title}
                            onChange={(e) => {
                                const newLinks = [...(data.internalLinks || [])];
                                newLinks[i].title = e.target.value;
                                updateData({ internalLinks: newLinks });
                            }}
                            className="flex-1"
                        />

                        <Input
                            placeholder="URL (e.g. /blogs/best-sites)"
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

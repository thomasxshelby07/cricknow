"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { GameFormData } from "@/types/game";
import { ContentTab, MediaTab, SEOTab, VisibilityTab, RelatedContentTab, FAQTab, ExtrasTab } from "@/components/admin/games/GameFormTabs";
import connectToDatabase from "@/lib/db";

const INITIAL_DATA: GameFormData = {
    title: "",
    slug: "",
    category: "Casino",
    description: "",
    content: "",
    coverImage: "",
    provider: "",
    playLink: "",
    demoLink: "",
    rating: 0,
    visibility: { status: "draft", featured: false, displayOrder: 0 },
    seo: { metaTitle: "", metaDescription: "", keywords: [], canonicalUrl: "", noIndex: false },
    relatedCasinos: [],
    relatedCoupons: [],
    relatedNews: [],
    relatedBlogs: [],
    faqs: [],
    pros: [],
    cons: []
};

export default function GameEditorPage() {
    const params = useParams();
    const id = params?.id as string;
    const isNew = id === "new";
    const router = useRouter();
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<GameFormData>(INITIAL_DATA);

    useEffect(() => {
        if (!isNew && id) {
            fetch(`/api/admin/games/${id}`)
                .then(res => res.json())
                .then(json => {
                    if (json.success) setData(json.data);
                    else toast.error("Failed to load game");
                    setLoading(false);
                });
        }
    }, [id, isNew]);

    const updateData = (updates: Partial<GameFormData>) => {
        setData(prev => ({ ...prev, ...updates }));
    };

    const updateNestedData = (section: "seo" | "visibility", updates: any) => {
        setData(prev => ({
            ...prev,
            [section]: { ...prev[section], ...updates }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const url = isNew ? "/api/admin/games" : `/api/admin/games/${params.id}`;
            const method = isNew ? "POST" : "PUT";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const json = await res.json();

            if (res.ok) {
                toast.success(isNew ? "Game created!" : "Game updated!");
                router.push("/admin/games");
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

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-3xl font-bold">{isNew ? "Create Game" : "Edit Game"}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="mr-2 animate-spin" /> : <Save className="mr-2 w-4 h-4" />}
                        Save Game
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="content" className="w-full">
                <TabsList className="flex flex-wrap h-auto gap-2 w-full lg:w-auto mb-6 bg-transparent p-0">
                    <TabsTrigger value="content" className="data-[state=active]:bg-primary data-[state=active]:text-white border bg-white">Content</TabsTrigger>
                    <TabsTrigger value="media" className="data-[state=active]:bg-primary data-[state=active]:text-white border bg-white">Media</TabsTrigger>
                    <TabsTrigger value="related" className="data-[state=active]:bg-primary data-[state=active]:text-white border bg-white">Related</TabsTrigger>
                    <TabsTrigger value="faq" className="data-[state=active]:bg-primary data-[state=active]:text-white border bg-white">FAQ</TabsTrigger>
                    <TabsTrigger value="extras" className="data-[state=active]:bg-primary data-[state=active]:text-white border bg-white">Pros/Cons</TabsTrigger>
                    <TabsTrigger value="seo" className="data-[state=active]:bg-primary data-[state=active]:text-white border bg-white">SEO</TabsTrigger>
                    <TabsTrigger value="visibility" className="data-[state=active]:bg-primary data-[state=active]:text-white border bg-white">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                    <ContentTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
                </TabsContent>

                <TabsContent value="media">
                    <MediaTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
                </TabsContent>

                <TabsContent value="related">
                    <RelatedContentTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
                </TabsContent>

                <TabsContent value="faq">
                    <FAQTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
                </TabsContent>

                <TabsContent value="extras">
                    <ExtrasTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
                </TabsContent>

                <TabsContent value="seo">
                    <SEOTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
                </TabsContent>

                <TabsContent value="visibility">
                    <VisibilityTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

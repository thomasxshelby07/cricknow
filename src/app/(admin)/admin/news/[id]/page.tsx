"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initialNewsState, NewsFormData } from "@/types/news";
import { BasicTab, SEOTab, VisibilityTab, MediaTab, ContentTab, FAQTab, InternalLinkingTab, RelatedContentTab } from "@/components/admin/news/NewsFormTabs";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function EditNewsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<NewsFormData>(initialNewsState);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/admin/news/${id}`)
            .then((res) => res.json())
            .then((json) => {
                if (json.success) {
                    const formattedData = {
                        ...json.data,
                        relatedSites: json.data.relatedSites?.map((s: any) => typeof s === 'object' ? s._id : s) || [],
                        relatedNews: json.data.relatedNews?.map((n: any) => typeof n === 'object' ? n._id : n) || [],
                        relatedBlogs: json.data.relatedBlogs?.map((b: any) => typeof b === 'object' ? b._id : b) || [],
                        relatedCoupons: json.data.relatedCoupons?.map((c: any) => typeof c === 'object' ? c._id : c) || []
                    };
                    setData(formattedData);
                }
                else {
                    toast.error("Failed to load news");
                    router.push("/admin/news");
                }
            })
            .catch(() => toast.error("Error loading news"))
            .finally(() => setLoading(false));
    }, [id, router]);

    const updateData = (updates: Partial<NewsFormData>) => {
        setData((prev) => ({ ...prev, ...updates }));
    };

    const updateNestedData = (section: "seo" | "visibility", updates: any) => {
        setData((prev) => ({
            ...prev,
            [section]: { ...prev[section], ...updates }
        }));
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/news/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.error);

            toast.success("News updated successfully!");
            router.push("/admin/news");
            router.refresh();
        } catch (err: any) {
            toast.error(err.message || "Failed to update");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure? This cannot be undone.")) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            toast.success("News deleted");
            router.push("/admin/news");
            router.refresh();
        } catch (err) {
            toast.error("Failed to delete");
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-dark">Edit News: {data.title}</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={saving}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                    <Button onClick={handleSubmit} disabled={saving} className="bg-primary hover:bg-secondary">
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="w-full flex flex-wrap h-auto gap-2 bg-white dark:bg-gray-800 p-2">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                    <TabsTrigger value="faqs">FAQs</TabsTrigger>
                    <TabsTrigger value="links">Links</TabsTrigger>
                    <TabsTrigger value="related">Related Content</TabsTrigger>
                    <TabsTrigger value="visibility">Visibility</TabsTrigger>
                </TabsList>

                <Card className="mt-4">
                    <CardContent className="pt-6">
                        <TabsContent value="basic">
                            <BasicTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
                        </TabsContent>
                        <TabsContent value="content">
                            <ContentTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
                        </TabsContent>
                        <TabsContent value="media">
                            <MediaTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
                        </TabsContent>
                        <TabsContent value="seo">
                            <SEOTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
                        </TabsContent>
                        <TabsContent value="faqs">
                            <FAQTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
                        </TabsContent>
                        <TabsContent value="links">
                            <InternalLinkingTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
                        </TabsContent>
                        <TabsContent value="related">
                            <RelatedContentTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
                        </TabsContent>
                        <TabsContent value="visibility">
                            <VisibilityTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
                        </TabsContent>
                    </CardContent>
                </Card>
            </Tabs>
        </div>
    );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initialNewsState, NewsFormData } from "@/types/news";
import { BasicTab, SEOTab, VisibilityTab, MediaTab, ContentTab, FAQTab, InternalLinkingTab, RelatedContentTab } from "@/components/admin/news/NewsFormTabs";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NewNewsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<NewsFormData>(initialNewsState);

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
        if (!data.title) return toast.error("Title is required");
        setLoading(true);

        try {
            const res = await fetch("/api/admin/news", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.error);

            toast.success("News created successfully!");
            router.push("/admin/news");
            router.refresh();
        } catch (err: any) {
            toast.error(err.message || "Failed to create news");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-dark">Add New News</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-primary hover:bg-secondary">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create News
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

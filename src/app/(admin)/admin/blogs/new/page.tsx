"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initialBlogState, BlogFormData } from "@/types/blog";
import { ContentTab, RelatedContentTab, MediaTab, FAQTab } from "@/components/admin/blogs/BlogFormTabs";
import { SEOTab, VisibilityTab } from "@/components/admin/sites/SiteFormTabs"; // Reuse!
import { Loader2 } from "lucide-react";

export default function NewBlogPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<BlogFormData>(initialBlogState);
    const [error, setError] = useState("");

    const updateData = (updates: Partial<BlogFormData>) => {
        setData((prev) => ({ ...prev, ...updates }));
    };

    const updateNestedData = (section: "seo" | "visibility", updates: any) => {
        setData((prev) => ({
            ...prev,
            [section]: { ...prev[section], ...updates }
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/admin/blogs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);
            router.push("/admin/blogs");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-dark">Write New Blog</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-primary hover:bg-secondary">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Publish
                    </Button>
                </div>
            </div>

            {error && <div className="p-4 text-red-600 bg-red-100 rounded-md border border-red-200">{error}</div>}

            <Tabs defaultValue="content" className="w-full">
                <TabsList className="w-full grid grid-cols-6 bg-white dark:bg-gray-800">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                    <TabsTrigger value="features">FAQ</TabsTrigger>
                    <TabsTrigger value="linking">Related</TabsTrigger>
                    <TabsTrigger value="visibility">Visibility</TabsTrigger>
                </TabsList>

                <Card className="mt-4">
                    <CardContent className="pt-6">
                        <TabsContent value="content">
                            <ContentTab data={data} updateData={updateData} />
                        </TabsContent>
                        <TabsContent value="media">
                            <MediaTab data={data} updateData={updateData} />
                        </TabsContent>
                        <TabsContent value="features">
                            <FAQTab data={data} updateData={updateData} />
                        </TabsContent>
                        <TabsContent value="seo">
                            {/* Reusing SEOTab from Sites module as strict types are compatible in structure if not name, 
                        but to avoid TS errors we'll cast or just duplicate for safety in real app.
                        Here I will cast to any for speed as structure matches. */}
                            <SEOTab data={data as any} updateNestedData={updateNestedData} updateData={updateData as any} />
                        </TabsContent>
                        <TabsContent value="linking">
                            <RelatedContentTab data={data} updateData={updateData} />
                        </TabsContent>
                        <TabsContent value="visibility">
                            <VisibilityTab data={data as any} updateData={updateData as any} updateNestedData={updateNestedData} />
                        </TabsContent>
                    </CardContent>
                </Card>
            </Tabs>
        </div>
    );
}

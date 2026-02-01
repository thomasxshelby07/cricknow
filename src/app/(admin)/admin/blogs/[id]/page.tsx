"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initialBlogState, BlogFormData } from "@/types/blog";
import { ContentTab, RelatedContentTab, MediaTab, FAQTab } from "@/components/admin/blogs/BlogFormTabs";
import { SEOTab, VisibilityTab } from "@/components/admin/sites/SiteFormTabs";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import React from 'react';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<BlogFormData>(initialBlogState);
    const [error, setError] = useState("");
    const { id } = React.use(params);

    useEffect(() => {
        if (!id) return;
        const fetchBlog = async () => {
            try {
                const res = await fetch(`/api/admin/blogs/${id}`);
                if (!res.ok) throw new Error("Failed to load blog");
                const json = await res.json();

                // Ensure relatedSite/Blogs are just arrays of IDs for the form
                const formattedData = {
                    ...json.data,
                    relatedSites: json.data.relatedSites?.map((s: any) => typeof s === 'object' ? s._id : s) || [],
                    relatedBlogs: json.data.relatedBlogs?.map((b: any) => typeof b === 'object' ? b._id : b) || [],
                    relatedNews: json.data.relatedNews?.map((n: any) => typeof n === 'object' ? n._id : n) || [],
                    relatedCoupons: json.data.relatedCoupons?.map((c: any) => typeof c === 'object' ? c._id : c) || []
                };

                setData(formattedData);
            } catch (err: any) {
                setError(err.message);
                toast.error("Error loading blog data");
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

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
        if (!id) return;
        setSaving(true);
        setError("");
        try {
            const res = await fetch(`/api/admin/blogs/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);
            toast.success("Blog updated successfully!");
            router.push("/admin/blogs");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            toast.error("Failed to update blog");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    if (error) return <div className="p-8 text-red-500 font-bold">Error: {error}</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-dark">Edit Blog</h1>
                    <p className="text-gray-500 text-sm">Update blog content and settings</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={saving} className="bg-primary hover:bg-secondary">
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </div>

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

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initialSiteState, BettingSiteFormData } from "@/types/site";
import { BasicTab, SEOTab, VisibilityTab, MediaTab, PageContentTab, FAQTab, InternalLinkingTab } from "@/components/admin/sites/SiteFormTabs";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function EditSitePage() {
    const router = useRouter();
    const params = useParams(); // Use hook instead of props
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<BettingSiteFormData>(initialSiteState);

    useEffect(() => {
        if (!id) return;
        // Fetch Site Data
        fetch(`/api/admin/sites/${id}`)
            .then((res) => res.json())
            .then((json) => {
                if (json.success) {
                    setData(json.data);
                } else {
                    toast.error("Failed to load site data");
                    router.push("/admin/sites");
                }
            })
            .catch(() => toast.error("Error loading site"))
            .finally(() => setLoading(false));
    }, [id, router]);

    const updateData = (updates: Partial<BettingSiteFormData>) => {
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
            const res = await fetch(`/api/admin/sites/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.error);

            toast.success("Site updated successfully!");
            router.push("/admin/sites"); // Go back to list
            router.refresh(); // Refresh list to show changes
        } catch (err: any) {
            toast.error(err.message || "Failed to update");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this site? This cannot be undone.")) return;

        setSaving(true);
        try {
            const res = await fetch(`/api/admin/sites/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete");

            toast.success("Site deleted.");
            router.push("/admin/sites");
            router.refresh();
        } catch (err) {
            toast.error("Failed to delete site.");
            setSaving(false);
        }
    };

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-dark">Edit Site: {data.name}</h1>
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
                    <TabsTrigger value="seo">SEO Settings</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="content">Page Content</TabsTrigger>
                    <TabsTrigger value="faqs">FAQs</TabsTrigger>
                    <TabsTrigger value="links">Internal Links</TabsTrigger>
                    <TabsTrigger value="visibility">Visibility</TabsTrigger>
                </TabsList>

                <Card className="mt-4">
                    <CardContent className="pt-6">
                        <TabsContent value="basic">
                            <BasicTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
                        </TabsContent>
                        <TabsContent value="seo">
                            <SEOTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
                        </TabsContent>
                        <TabsContent value="media">
                            <MediaTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
                        </TabsContent>
                        <TabsContent value="content">
                            <PageContentTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
                        </TabsContent>
                        <TabsContent value="visibility">
                            <VisibilityTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
                        </TabsContent>
                        <TabsContent value="faqs">
                            <FAQTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
                        </TabsContent>
                        <TabsContent value="links">
                            <InternalLinkingTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
                        </TabsContent>
                    </CardContent>
                </Card>
            </Tabs>
        </div>
    );
}

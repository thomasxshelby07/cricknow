"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initialSiteState, BettingSiteFormData } from "@/types/site";
import { BasicTab, SEOTab, VisibilityTab, MediaTab, PageContentTab, FAQTab, InternalLinkingTab } from "@/components/admin/sites/SiteFormTabs";
import { Loader2 } from "lucide-react";

export default function NewSitePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<BettingSiteFormData>(initialSiteState);
    const [error, setError] = useState("");

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
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/sites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const json = await res.json();

            if (!res.ok) throw new Error(json.error);

            router.push("/admin/sites");
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
                <h1 className="text-3xl font-bold tracking-tight text-neutral-dark">Add New Site</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-primary hover:bg-secondary">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Site
                    </Button>
                </div>
            </div>

            {error && <div className="p-4 text-red-600 bg-red-100 rounded-md border border-red-200">{error}</div>}

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
                        <TabsContent value="faqs">
                            <FAQTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
                        </TabsContent>
                        <TabsContent value="links">
                            <InternalLinkingTab data={data} updateData={updateData} updateNestedData={updateNestedData} />
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

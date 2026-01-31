"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
// import Select from "react-select"; // Removed unused import

interface HomeConfigFormProps {
    initialConfig: any;
    allSites: any[];
    allBlogs: any[];
    allNews: any[];
}

export function HomeConfigForm({ initialConfig, allSites, allBlogs, allNews }: HomeConfigFormProps) {
    const [config, setConfig] = useState(initialConfig);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/config/home", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config),
            });

            if (!res.ok) throw new Error("Failed to save");

            toast.success("Home Page configuration updated!");
        } catch (error) {
            toast.error("Failed to update configuration.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Helper for multi-select changes (simulated with checkboxes for simplicity if no complex UI lib)
    const toggleSelection = (section: 'bettingSites' | 'blogs' | 'news', id: string) => {
        const currentIds = config[section]?.selectedIds || [];
        const newIds = currentIds.includes(id)
            ? currentIds.filter((cid: string) => cid !== id)
            : [...currentIds, id];

        setConfig({
            ...config,
            [section]: { ...config[section], selectedIds: newIds }
        });
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Home Page Configuration</h1>
                <Button onClick={handleSave} disabled={loading} className="gap-2">
                    {loading ? <Loader2 className="animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </Button>
            </div>

            {/* Betting Sites */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Betting Sites Section</CardTitle>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="betting-visible"
                                checked={config.bettingSites.isVisible}
                                onCheckedChange={(c) => setConfig({ ...config, bettingSites: { ...config.bettingSites, isVisible: c } })}
                            />
                            <Label htmlFor="betting-visible">Visible</Label>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">Select sites to display. Order is based on selection (drag-drop pending, currently selection order).</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto border p-2 rounded">
                            {allSites.map(site => (
                                <div key={site._id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                                    <input
                                        type="checkbox"
                                        id={`site-${site._id}`}
                                        checked={config.bettingSites.selectedIds?.includes(site._id)}
                                        onChange={() => toggleSelection('bettingSites', site._id)}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor={`site-${site._id}`} className="cursor-pointer flex-1">{site.name}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Blogs */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Blogs Section</CardTitle>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="blogs-visible"
                                checked={config.blogs.isVisible}
                                onCheckedChange={(c) => setConfig({ ...config, blogs: { ...config.blogs, isVisible: c } })}
                            />
                            <Label htmlFor="blogs-visible">Visible</Label>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">Select blogs to display.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto border p-2 rounded">
                            {allBlogs.map(blog => (
                                <div key={blog._id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                                    <input
                                        type="checkbox"
                                        id={`blog-${blog._id}`}
                                        checked={config.blogs.selectedIds?.includes(blog._id)}
                                        onChange={() => toggleSelection('blogs', blog._id)}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor={`blog-${blog._id}`} className="cursor-pointer flex-1">{blog.title}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* News */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>News Section</CardTitle>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="news-visible"
                                checked={config.news.isVisible}
                                onCheckedChange={(c) => setConfig({ ...config, news: { ...config.news, isVisible: c } })}
                            />
                            <Label htmlFor="news-visible">Visible</Label>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">Select news to display.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto border p-2 rounded">
                            {allNews.map(news => (
                                <div key={news._id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                                    <input
                                        type="checkbox"
                                        id={`news-${news._id}`}
                                        checked={config.news.selectedIds?.includes(news._id)}
                                        onChange={() => toggleSelection('news', news._id)}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor={`news-${news._id}`} className="cursor-pointer flex-1">{news.title}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Search, Newspaper, Edit, Trash2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { NewsFormData } from "@/types/news";

export default function NewsListPage() {
    const [news, setNews] = useState<NewsFormData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await fetch("/api/admin/news");
            const json = await res.json();
            if (json.success) {
                setNews(json.data);
            }
        } catch (error) {
            toast.error("Failed to fetch news");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
            if (res.ok) {
                setNews((prev) => prev.filter((n) => n._id !== id));
                toast.success("News deleted");
            } else {
                toast.error("Failed to delete");
            }
        } catch (error) {
            toast.error("Error deleting news");
        }
    };

    const filteredNews = news.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-dark">News Manager</h1>
                    <p className="text-gray-500">Manage global cricket news and updates.</p>
                </div>
                <Link href="/admin/news/new">
                    <Button className="bg-primary hover:bg-secondary text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add News
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
                <Search className="text-gray-400 w-5 h-5" />
                <Input
                    placeholder="Search news..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-none shadow-none focus-visible:ring-0"
                />
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-20">Loading...</div>
                ) : filteredNews.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                        <Newspaper className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">No news found</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new news article.</p>
                    </div>
                ) : (
                    filteredNews.map((item) => (
                        <Card key={item._id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                    {item.coverImageUrl ? (
                                        <img src={item.coverImageUrl} alt={item.title} className="h-full w-full object-cover" />
                                    ) : (
                                        <Newspaper className="h-8 w-8 m-auto text-gray-400 mt-4" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                                        <Badge variant={item.visibility.status === 'published' ? 'default' : 'secondary'} className="capitalize">
                                            {item.visibility.status}
                                        </Badge>
                                        {item.isFeatured && <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Featured</Badge>}
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">{item.slug}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link href={`/news/${item.slug}`} target="_blank">
                                        <Button size="icon" variant="ghost" title="View Live">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/news/${item._id}`}>
                                        <Button size="icon" variant="ghost" title="Edit">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                    <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(item._id!)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

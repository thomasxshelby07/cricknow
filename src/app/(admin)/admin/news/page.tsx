"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Loader2, Plus, Trash2, Eye, Newspaper, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { DraggableTable } from "@/components/admin/DraggableTable";
import { DraggableRow } from "@/components/admin/DraggableRow";
import { usePermissions } from "@/components/admin/PermissionGuard";
import { useRouter } from "next/navigation";

export default function NewsListPage() {
    const router = useRouter();
    const { hasPermission } = usePermissions();
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Check permission
    useEffect(() => {
        if (!hasPermission('manage_news')) {
            router.push('/admin');
            toast.error("You don't have permission to manage news");
        }
    }, [hasPermission, router]);

    // Filters & Sorting state
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [featuredFilter, setFeaturedFilter] = useState("all");
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'visibility.displayOrder', direction: 'asc' });

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

    useEffect(() => {
        fetchNews();
    }, []);

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

    const handleReorder = async (reorderedItems: any[]) => {
        setNews(reorderedItems);
        try {
            const res = await fetch("/api/admin/news", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: reorderedItems }),
            });
            if (res.ok) {
                toast.success("Order updated");
            } else {
                toast.error("Failed to update order");
                fetchNews(); // Revert on error
            }
        } catch (error) {
            toast.error("Error updating order");
            fetchNews(); // Revert on error
        }
    };

    // Filter Logic
    const filteredNews = news.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || item.visibility?.status === statusFilter;
        const matchesFeatured = featuredFilter === 'all' ||
            (featuredFilter === 'featured' && item.isFeatured) ||
            (featuredFilter === 'not-featured' && !item.isFeatured);
        return matchesSearch && matchesCategory && matchesStatus && matchesFeatured;
    });

    // Sort Logic
    const sortedNews = [...filteredNews].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested paths
        if (sortConfig.key === 'status') {
            aValue = a.visibility?.status || '';
            bValue = b.visibility?.status || '';
        } else if (sortConfig.key === 'visibility.displayOrder') {
            aValue = a.visibility?.displayOrder || 0;
            bValue = b.visibility?.displayOrder || 0;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

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

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex-1">
                    <Input
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="Cricket Betting">Cricket Betting</SelectItem>
                            <SelectItem value="Casino News">Casino News</SelectItem>
                            <SelectItem value="Platform Updates">Platform Updates</SelectItem>
                            <SelectItem value="General">General</SelectItem>
                            <SelectItem value="Betting News">Betting News</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Featured" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="featured">Featured</SelectItem>
                            <SelectItem value="not-featured">Not Featured</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sortConfig.key} onValueChange={(val) => handleSort(val)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="visibility.displayOrder">Display Order</SelectItem>
                            <SelectItem value="createdAt">Date Created</SelectItem>
                            <SelectItem value="title">Title</SelectItem>
                            <SelectItem value="category">Category</SelectItem>
                            <SelectItem value="status">Status</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon" onClick={() => setSortConfig(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }))}>
                        {sortConfig.direction === 'asc' ? "↑" : "↓"}
                    </Button>
                </div>
            </div>

            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <DraggableTable items={sortedNews} onReorder={handleReorder}>
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-8"></TableHead>
                                <TableHead className="cursor-pointer hover:text-black" onClick={() => handleSort('title')}>
                                    Title {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </TableHead>
                                <TableHead className="cursor-pointer hover:text-black" onClick={() => handleSort('category')}>
                                    Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </TableHead>
                                <TableHead className="cursor-pointer hover:text-black" onClick={() => handleSort('status')}>
                                    Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </TableHead>
                                <TableHead>Featured</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedNews.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                                        <Newspaper className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                                        No news found matching your filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedNews.map((item) => (
                                    <DraggableRow key={item._id} id={item._id} className="hover:bg-gray-50 transition-colors">
                                        <TableCell className="font-semibold text-gray-900">{item.title}</TableCell>
                                        <TableCell className="capitalize">
                                            <Badge variant="outline">{item.category}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`${item.visibility?.status === "published" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-700 hover:bg-gray-100"}`}>
                                                {item.visibility?.status || 'draft'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {item.isFeatured && <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Featured</Badge>}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/news/${item.slug}`} target="_blank">
                                                    <Button size="sm" variant="ghost" title="View Live">
                                                        <Eye className="h-4 w-4 text-gray-500" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/news/${item._id}`}>
                                                    <Button size="sm" variant="ghost">
                                                        <Edit className="h-4 w-4 text-gray-500" />
                                                    </Button>
                                                </Link>
                                                <Button size="sm" variant="ghost" onClick={() => handleDelete(item._id!)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </DraggableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </DraggableTable>
            </div>
            <div className="text-xs text-gray-500 text-right">
                Showing {sortedNews.length} of {news.length} news items
            </div>
        </div>
    );
}

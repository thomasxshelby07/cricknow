"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Loader2, Plus, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { DraggableTable } from "@/components/admin/DraggableTable";
import { DraggableRow } from "@/components/admin/DraggableRow";
import { usePermissions } from "@/components/admin/PermissionGuard";
import { useRouter } from "next/navigation";

export default function BlogsListPage() {
    const router = useRouter();
    const { hasPermission } = usePermissions();
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Check permission
    useEffect(() => {
        if (!hasPermission('manage_blogs')) {
            router.push('/admin');
            toast.error("You don't have permission to manage blogs");
        }
    }, [hasPermission, router]);

    // Filters & Sorting state
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [featuredFilter, setFeaturedFilter] = useState("all");
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'visibility.displayOrder', direction: 'asc' });

    const fetchBlogs = async () => {
        try {
            const res = await fetch("/api/admin/blogs");
            const json = await res.json();
            if (json.success) {
                setBlogs(json.data);
            }
        } catch (error) {
            toast.error("Failed to fetch blogs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this blog?")) return;
        try {
            const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
            if (res.ok) {
                setBlogs(blogs.filter(b => b._id !== id));
                toast.success("Blog deleted");
            } else {
                toast.error("Failed to delete");
            }
        } catch (e) {
            console.error(e);
            toast.error("Error deleting blog");
        }
    };

    const handleReorder = async (reorderedItems: any[]) => {
        setBlogs(reorderedItems);
        try {
            const res = await fetch("/api/admin/blogs", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: reorderedItems }),
            });
            if (res.ok) {
                toast.success("Order updated");
            } else {
                toast.error("Failed to update order");
                fetchBlogs();
            }
        } catch (error) {
            toast.error("Error updating order");
            fetchBlogs();
        }
    };

    // Filter Logic
    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || blog.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || blog.visibility?.status === statusFilter;
        const matchesFeatured = featuredFilter === 'all' ||
            (featuredFilter === 'featured' && blog.isFeatured) ||
            (featuredFilter === 'not-featured' && !blog.isFeatured);
        return matchesSearch && matchesCategory && matchesStatus && matchesFeatured;
    });

    // Sort Logic
    const sortedBlogs = [...filteredBlogs].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

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
                <h1 className="text-3xl font-bold tracking-tight text-neutral-dark">Blogs</h1>
                <Link href="/admin/blogs/new">
                    <Button className="bg-primary hover:bg-secondary"><Plus className="mr-2 h-4 w-4" /> Write Blog</Button>
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
                            <SelectItem value="betting">Betting</SelectItem>
                            <SelectItem value="casino">Casino</SelectItem>
                            <SelectItem value="cricket">Cricket</SelectItem>
                            <SelectItem value="guides">Guides</SelectItem>
                            <SelectItem value="news">News</SelectItem>
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

            <div className="rounded-md border bg-white shadow-sm">
                <DraggableTable items={sortedBlogs} onReorder={handleReorder}>
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
                            {sortedBlogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                                        <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                                        No blogs found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedBlogs.map((blog) => (
                                    <DraggableRow key={blog._id} id={blog._id} className="hover:bg-gray-50 transition-colors">
                                        <TableCell className="font-medium">{blog.title}</TableCell>
                                        <TableCell className="capitalize">
                                            <Badge variant="outline">{blog.category}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={blog.visibility?.status === "published" ? "default" : "secondary"}>
                                                {blog.visibility?.status || 'draft'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {blog.isFeatured && <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Featured</Badge>}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/blogs/${blog._id}`}>
                                                    <Button size="sm" variant="ghost">
                                                        <Edit className="h-4 w-4 text-gray-500 hover:text-primary" />
                                                    </Button>
                                                </Link>
                                                <Button size="sm" variant="ghost" onClick={() => handleDelete(blog._id)}>
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
                Showing {sortedBlogs.length} of {blogs.length} blogs
            </div>
        </div>
    );
}

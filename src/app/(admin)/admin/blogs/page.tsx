"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";

export default function BlogsListPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/blogs")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setBlogs(data.data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-dark">Blogs</h1>
                <Link href="/admin/blogs/new">
                    <Button className="bg-primary hover:bg-secondary"><Plus className="mr-2 h-4 w-4" /> Write Blog</Button>
                </Link>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {blogs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24 text-gray-500">No blogs found.</TableCell>
                            </TableRow>
                        ) : (
                            blogs.map((blog) => (
                                <TableRow key={blog._id}>
                                    <TableCell className="font-medium">{blog.title}</TableCell>
                                    <TableCell className="capitalize">{blog.category}</TableCell>
                                    <TableCell>
                                        <Badge variant={blog.visibility.status === "published" ? "default" : "secondary"}>
                                            {blog.visibility.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right flex items-center justify-end gap-2">
                                        <Link href={`/admin/blogs/${blog._id}`}>
                                            <Button size="sm" variant="ghost">
                                                <Edit className="h-4 w-4 text-gray-500 hover:text-primary" />
                                            </Button>
                                        </Link>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={async () => {
                                                if (confirm("Are you sure you want to delete this blog?")) {
                                                    try {
                                                        const res = await fetch(`/api/admin/blogs/${blog._id}`, { method: "DELETE" });
                                                        if (res.ok) {
                                                            setBlogs(blogs.filter(b => b._id !== blog._id));
                                                            // toast.success("Blog deleted"); // Assuming toast is available or add import
                                                        } else {
                                                            alert("Failed to delete");
                                                        }
                                                    } catch (e) {
                                                        console.error(e);
                                                    }
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

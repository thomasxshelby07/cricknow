"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Loader2, Plus, Trash2, List } from "lucide-react";

export default function CategoriesListPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/game-categories")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setCategories(data.data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <List className="w-8 h-8 text-neutral-dark" />
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-dark">Game Categories</h1>
                </div>
                <Link href="/admin/game-categories/new">
                    <Button className="bg-primary hover:bg-secondary"><Plus className="mr-2 h-4 w-4" /> Add Category</Button>
                </Link>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Icon</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Link</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-gray-500">No categories found.</TableCell>
                            </TableRow>
                        ) : (
                            categories.map((cat) => (
                                <TableRow key={cat._id}>
                                    <TableCell>
                                        {cat.iconUrl ? (
                                            <img src={cat.iconUrl} alt={cat.name} className="w-8 h-8 object-contain rounded bg-gray-100 p-1" />
                                        ) : (
                                            <span className="text-xs text-gray-400">None</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{cat.name}</TableCell>
                                    <TableCell className="text-gray-500 text-sm">{cat.linkPath || "-"}</TableCell>
                                    <TableCell>{cat.displayOrder}</TableCell>
                                    <TableCell className="text-right flex items-center justify-end gap-2">
                                        <Link href={`/admin/game-categories/${cat._id}`}>
                                            <Button size="sm" variant="ghost">
                                                <Edit className="h-4 w-4 text-gray-500 hover:text-primary" />
                                            </Button>
                                        </Link>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={async () => {
                                                if (confirm("Delete this category?")) {
                                                    await fetch(`/api/admin/game-categories/${cat._id}`, { method: "DELETE" });
                                                    setCategories(categories.filter(c => c._id !== cat._id));
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

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DraggableTable } from "@/components/admin/DraggableTable";
import { DraggableRow } from "@/components/admin/DraggableRow";
import { usePermissions } from "@/components/admin/PermissionGuard";

export default function SitesListPage() {
    const router = useRouter();
    const { hasPermission } = usePermissions();
    const [sites, setSites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Check permission
    useEffect(() => {
        if (!hasPermission('manage_sites')) {
            router.push('/admin');
            toast.error("You don't have permission to manage betting sites");
        }
    }, [hasPermission, router]);

    // Filters & Sorting state
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'createdAt', direction: 'desc' });

    const fetchSites = () => {
        fetch("/api/admin/sites", { cache: 'no-store' })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setSites(data.data);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchSites();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this site?")) return;
        try {
            await fetch(`/api/admin/sites/${id}`, { method: 'DELETE' });
            toast.success("Site deleted");
            fetchSites(); // Refresh
        } catch (e) {
            toast.error("Failed to delete");
        }
    };

    const handleReorder = async (reorderedItems: any[]) => {
        setSites(reorderedItems);
        try {
            const res = await fetch("/api/admin/sites", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: reorderedItems }),
            });
            if (res.ok) {
                toast.success("Order updated");
            } else {
                toast.error("Failed to update order");
                fetchSites();
            }
        } catch (error) {
            toast.error("Error updating order");
            fetchSites();
        }
    };

    // Filter Logic
    const filteredSites = sites.filter(site => {
        const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || site.type === typeFilter;
        return matchesSearch && matchesType;
    });

    // Sort Logic
    const sortedSites = [...filteredSites].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested visibility status if needed, simplified here
        if (sortConfig.key === 'status') {
            aValue = a.visibility.status;
            bValue = b.visibility.status;
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
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-dark">Betting Sites</h1>
                    <p className="text-gray-500">Manage all betting sites, reviews, and rankings.</p>
                </div>
                <Link href="/admin/sites/new">
                    <Button className="bg-primary hover:bg-secondary"><Plus className="mr-2 h-4 w-4" /> Add Site</Button>
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex-1">
                    <Input
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
                <div className="flex gap-2">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="betting">Betting</SelectItem>
                            <SelectItem value="casino">Casino</SelectItem>
                            <SelectItem value="cricket">Cricket</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sortConfig.key} onValueChange={(val) => handleSort(val)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="createdAt">Date Created</SelectItem>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="rating">Rating</SelectItem>
                            <SelectItem value="status">Status</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon" onClick={() => setSortConfig(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }))}>
                        {sortConfig.direction === 'asc' ? "↑" : "↓"}
                    </Button>
                </div>
            </div>

            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <DraggableTable items={sortedSites} onReorder={handleReorder}>
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-8"></TableHead>
                                <TableHead className="cursor-pointer hover:text-black" onClick={() => handleSort('name')}>Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</TableHead>
                                <TableHead className="cursor-pointer hover:text-black" onClick={() => handleSort('type')}>Type {sortConfig.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</TableHead>
                                <TableHead className="cursor-pointer hover:text-black" onClick={() => handleSort('rating')}>Rating {sortConfig.key === 'rating' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</TableHead>
                                <TableHead className="cursor-pointer hover:text-black" onClick={() => handleSort('status')}>Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedSites.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-gray-500">No sites found matching your filters.</TableCell>
                                </TableRow>
                            ) : (
                                sortedSites.map((site) => (
                                    <DraggableRow key={site._id} id={site._id} className="hover:bg-gray-50 transition-colors">
                                        <TableCell className="font-bold text-gray-900">{site.name}</TableCell>
                                        <TableCell className="capitalize">
                                            <Badge variant="outline">{site.type}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-semibold">{site.rating}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`${site.visibility.status === "published" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-700 hover:bg-gray-100"}`}>
                                                {site.visibility.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="ghost" onClick={() => router.push(`/admin/sites/${site._id}`)}>
                                                    <Edit className="h-4 w-4 text-gray-500" />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => handleDelete(site._id)}>
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
                Showing {sortedSites.length} of {sites.length} sites
            </div>
        </div>
    );
}

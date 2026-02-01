"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, Tag } from "lucide-react";
import { toast } from "sonner";
import { DraggableTable } from "@/components/admin/DraggableTable";
import { DraggableRow } from "@/components/admin/DraggableRow";
import { usePermissions } from "@/components/admin/PermissionGuard";
import { useRouter } from "next/navigation";

export default function CouponsPage() {
    const router = useRouter();
    const { hasPermission } = usePermissions();
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Check permission
    useEffect(() => {
        if (!hasPermission('manage_coupons')) {
            router.push('/admin');
            toast.error("You don't have permission to manage coupons");
        }
    }, [hasPermission, router]);

    // Filters & Sorting state
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [visibilityFilter, setVisibilityFilter] = useState("all");
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'visibility.displayOrder', direction: 'asc' });

    const fetchCoupons = async () => {
        try {
            const res = await fetch("/api/admin/coupons");
            const json = await res.json();
            if (json.success) {
                setCoupons(json.data);
            }
        } catch (error) {
            toast.error("Failed to fetch coupons");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this coupon?")) return;
        try {
            const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
            if (res.ok) {
                setCoupons(coupons.filter(c => c._id !== id));
                toast.success("Coupon deleted");
            } else {
                toast.error("Failed to delete");
            }
        } catch (e) {
            console.error(e);
            toast.error("Error deleting coupon");
        }
    };

    const handleReorder = async (reorderedItems: any[]) => {
        setCoupons(reorderedItems);
        try {
            const res = await fetch("/api/admin/coupons", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: reorderedItems }),
            });
            if (res.ok) {
                toast.success("Order updated");
            } else {
                toast.error("Failed to update order");
                fetchCoupons();
            }
        } catch (error) {
            toast.error("Error updating order");
            fetchCoupons();
        }
    };

    // Filter Logic
    const filteredCoupons = coupons.filter(coupon => {
        const matchesSearch = coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (coupon.couponCode && coupon.couponCode.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || coupon.visibility?.status === statusFilter;
        const matchesVisibility = visibilityFilter === 'all' ||
            (visibilityFilter === 'home' && coupon.showOnHome) ||
            (visibilityFilter === 'blog' && coupon.showOnBlog) ||
            (visibilityFilter === 'news' && coupon.showOnNews) ||
            (visibilityFilter === 'bonuses' && coupon.showOnBonuses);
        return matchesSearch && matchesStatus && matchesVisibility;
    });

    // Sort Logic
    const sortedCoupons = [...filteredCoupons].sort((a, b) => {
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-black dark:text-white">Coupons & Promotions</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage promotional coupons and offers</p>
                </div>
                <Link href="/admin/coupons/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" /> Create Coupon
                    </Button>
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex-1">
                    <Input
                        placeholder="Search by name or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
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

                    <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Visibility" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Visibility</SelectItem>
                            <SelectItem value="home">Show on Home</SelectItem>
                            <SelectItem value="blog">Show on Blog</SelectItem>
                            <SelectItem value="news">Show on News</SelectItem>
                            <SelectItem value="bonuses">Show on Bonuses</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sortConfig.key} onValueChange={(val) => handleSort(val)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="visibility.displayOrder">Display Order</SelectItem>
                            <SelectItem value="createdAt">Date Created</SelectItem>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="status">Status</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon" onClick={() => setSortConfig(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }))}>
                        {sortConfig.direction === 'asc' ? "↑" : "↓"}
                    </Button>
                </div>
            </div>

            {/* Coupons Table */}
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <DraggableTable items={sortedCoupons} onReorder={handleReorder}>
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700">
                                <tr>
                                    <th className="px-2 py-3 w-8"></th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-black" onClick={() => handleSort('name')}>
                                        Coupon {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                        Code
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                        Visibility
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-black" onClick={() => handleSort('status')}>
                                        Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                                {sortedCoupons.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            <Tag className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                                            No coupons found. Create your first coupon!
                                        </td>
                                    </tr>
                                ) : (
                                    sortedCoupons.map((coupon: any) => (
                                        <DraggableRow key={coupon._id} id={coupon._id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {coupon.imageUrl && (
                                                        <img
                                                            src={coupon.imageUrl}
                                                            alt={coupon.name}
                                                            className="w-16 h-10 object-cover rounded"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-black dark:text-white">{coupon.name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{coupon.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {coupon.couponCode ? (
                                                    <code className="px-2 py-1 bg-gray-100 dark:bg-neutral-800 rounded text-xs font-mono">
                                                        {coupon.couponCode}
                                                    </code>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-1">
                                                    {coupon.showOnHome && (
                                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded">
                                                            Home
                                                        </span>
                                                    )}
                                                    {coupon.showOnBlog && (
                                                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded">
                                                            Blog
                                                        </span>
                                                    )}
                                                    {coupon.showOnNews && (
                                                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold rounded">
                                                            News
                                                        </span>
                                                    )}
                                                    {coupon.showOnBonuses && (
                                                        <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded">
                                                            Bonuses
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {coupon.visibility?.status === "published" ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded">
                                                        <Eye className="w-3 h-3" /> Published
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold rounded">
                                                        <EyeOff className="w-3 h-3" /> Draft
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/admin/coupons/${coupon._id}`}>
                                                        <Button variant="ghost" size="sm" className="gap-1">
                                                            <Edit className="w-4 h-4" /> Edit
                                                        </Button>
                                                    </Link>
                                                    <Button variant="ghost" size="sm" className="gap-1 text-red-600 hover:text-red-700" onClick={() => handleDelete(coupon._id)}>
                                                        <Trash2 className="w-4 h-4" /> Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </DraggableRow>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </DraggableTable>
                </div>
            </div>
            <div className="text-xs text-gray-500 text-right">
                Showing {sortedCoupons.length} of {coupons.length} coupons
            </div>
        </div>
    );
}

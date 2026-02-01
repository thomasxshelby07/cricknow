"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, PenSquare, Trash2, Megaphone, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { DraggableTable } from "@/components/admin/DraggableTable";
import { DraggableRow } from "@/components/admin/DraggableRow";
import { usePermissions } from "@/components/admin/PermissionGuard";
import { useRouter } from "next/navigation";

export default function PromotionsPage() {
    const router = useRouter();
    const { hasPermission } = usePermissions();
    const [promotions, setPromotions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Check permission
    useEffect(() => {
        if (!hasPermission('manage_promotions')) {
            router.push('/admin');
            toast.error("You don't have permission to manage promotions");
        }
    }, [hasPermission, router]);

    // Filters & Sorting state
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [visibilityFilter, setVisibilityFilter] = useState("all");
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'visibility.displayOrder', direction: 'asc' });

    const fetchPromotions = async () => {
        try {
            const res = await fetch("/api/admin/promotions");
            const data = await res.json();
            setPromotions(data);
        } catch (error) {
            toast.error("Failed to fetch promotions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this promotion?")) return;
        try {
            const res = await fetch(`/api/admin/promotions/${id}`, { method: "DELETE" });
            if (res.ok) {
                setPromotions(promotions.filter(p => p._id !== id));
                toast.success("Promotion deleted");
            } else {
                toast.error("Failed to delete");
            }
        } catch (e) {
            console.error(e);
            toast.error("Error deleting promotion");
        }
    };

    const handleReorder = async (reorderedItems: any[]) => {
        setPromotions(reorderedItems);
        try {
            const res = await fetch("/api/admin/promotions", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: reorderedItems }),
            });
            if (res.ok) {
                toast.success("Order updated");
            } else {
                toast.error("Failed to update order");
                fetchPromotions();
            }
        } catch (error) {
            toast.error("Error updating order");
            fetchPromotions();
        }
    };

    // Filter Logic
    const filteredPromotions = promotions.filter(promo => {
        const matchesSearch = promo.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || promo.visibility?.status === statusFilter;
        const matchesVisibility = visibilityFilter === 'all' ||
            (visibilityFilter === 'home' && promo.showOnHome) ||
            (visibilityFilter === 'blog' && promo.showOnBlog) ||
            (visibilityFilter === 'news' && promo.showOnNews) ||
            (visibilityFilter === 'offers' && promo.showOnOffers);
        return matchesSearch && matchesStatus && matchesVisibility;
    });

    // Sort Logic
    const sortedPromotions = [...filteredPromotions].sort((a, b) => {
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
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Megaphone className="w-6 h-6 text-primary" /> Ad Campaigns
                    </h1>
                    <p className="text-gray-500">Manage promotional banners for sidebar and in-content ads.</p>
                </div>
                <Link href="/admin/promotions/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" /> CREATE NEW AD
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
                            <SelectItem value="offers">Show on Offers</SelectItem>
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
                            <SelectItem value="status">Status</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon" onClick={() => setSortConfig(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }))}>
                        {sortConfig.direction === 'asc' ? "↑" : "↓"}
                    </Button>
                </div>
            </div>

            <DraggableTable items={sortedPromotions} onReorder={handleReorder}>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedPromotions.length === 0 ? (
                        <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-900">No Ads Found</h3>
                            <p className="text-gray-500 mb-6">Create your first advertisement to monetize your content.</p>
                            <Link href="/admin/promotions/new">
                                <Button variant="outline">Create Ad</Button>
                            </Link>
                        </div>
                    ) : (sortedPromotions.map((promo: any) => (
                        <DraggableRow key={promo._id} id={promo._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden group flex flex-col">
                            {/* Preview Area */}
                            <div className="aspect-[2/1] bg-gray-100 dark:bg-gray-900 relative flex items-center justify-center p-4 border-b">
                                {promo.images?.horizontal ? (
                                    <img src={promo.images.horizontal} alt="Preview" className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <span className="text-xs text-gray-400">No Horizontal Image</span>
                                )}

                                <div className="absolute top-2 right-2">
                                    <Badge variant={promo.visibility?.status === 'published' ? 'default' : 'secondary'}>
                                        {promo.visibility?.status || 'Draft'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg mb-1 truncate" title={promo.title}>{promo.title}</h3>
                                <div className="text-xs text-gray-500 mb-4 space-y-1">
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium">Button:</span> {promo.ctaText}
                                    </div>
                                    <div className="flex items-center gap-1 truncate" title={promo.redirectUrl}>
                                        <span className="font-medium">Link:</span> {promo.redirectUrl}
                                    </div>
                                </div>

                                <div className="mt-auto flex items-center justify-end gap-2 pt-3 border-t">
                                    <Link href={`/admin/promotions/${promo._id}`}>
                                        <Button size="sm" variant="outline" className="h-8">
                                            <PenSquare className="w-3 h-3 mr-1" /> Edit
                                        </Button>
                                    </Link>
                                    <Button size="sm" variant="ghost" className="h-8 text-red-600 hover:text-red-700" onClick={() => handleDelete(promo._id)}>
                                        <Trash2 className="w-3 h-3 mr-1" /> Delete
                                    </Button>
                                </div>
                            </div>
                        </DraggableRow>
                    )))}
                </div>
            </DraggableTable>
            <div className="text-xs text-gray-500 text-right">
                Showing {sortedPromotions.length} of {promotions.length} promotions
            </div>
        </div>
    );
}

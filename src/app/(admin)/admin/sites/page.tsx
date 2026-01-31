"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SitesListPage() {
    const [sites, setSites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-dark">Betting Sites</h1>
                <Link href="/admin/sites/new">
                    <Button className="bg-primary hover:bg-secondary"><Plus className="mr-2 h-4 w-4" /> Add Site</Button>
                </Link>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sites.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-gray-500">No sites found. Create one to get started.</TableCell>
                            </TableRow>
                        ) : (
                            sites.map((site) => (
                                <TableRow key={site._id}>
                                    <TableCell className="font-medium">{site.name}</TableCell>
                                    <TableCell className="capitalize">{site.type}</TableCell>
                                    <TableCell>{site.rating}</TableCell>
                                    <TableCell>
                                        <Badge variant={site.visibility.status === "published" ? "default" : "secondary"}>
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
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

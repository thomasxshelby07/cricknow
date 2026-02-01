"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Loader2, Plus, Trash2, UserCog, Shield, ShieldCheck, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { usePermissions } from "@/components/admin/PermissionGuard";
import { useRouter } from "next/navigation";
import { getPermissionLabel } from "@/lib/permissions";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { isSuperAdmin } = usePermissions();
    const router = useRouter();

    // Redirect if not super admin
    useEffect(() => {
        if (!isSuperAdmin()) {
            router.push('/admin');
            toast.error("Access denied: Super Admin only");
        }
    }, [isSuperAdmin, router]);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`/api/admin/users?q=${searchTerm}`);
            const json = await res.json();
            if (json.success) {
                setUsers(json.data);
            }
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isSuperAdmin()) {
            fetchUsers();
        }
    }, [searchTerm, isSuperAdmin]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to deactivate this admin?")) return;

        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
            const json = await res.json();

            if (json.success) {
                toast.success("Admin deactivated");
                fetchUsers();
            } else {
                toast.error(json.error || "Failed to deactivate");
            }
        } catch (error) {
            toast.error("Error deactivating admin");
        }
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !currentStatus }),
            });

            const json = await res.json();

            if (json.success) {
                toast.success(`Admin ${!currentStatus ? 'activated' : 'deactivated'}`);
                fetchUsers();
            } else {
                toast.error(json.error || "Failed to update status");
            }
        } catch (error) {
            toast.error("Error updating admin status");
        }
    };

    if (!isSuperAdmin()) {
        return null;
    }

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-dark flex items-center gap-2">
                        <UserCog className="h-8 w-8" />
                        Admin Users
                    </h1>
                    <p className="text-gray-500 mt-1">Manage admin users and their permissions</p>
                </div>
                <Link href="/admin/users/new">
                    <Button className="bg-primary hover:bg-secondary">
                        <Plus className="mr-2 h-4 w-4" /> Create Admin
                    </Button>
                </Link>
            </div>

            {/* Search Bar */}
            <div className="flex gap-4 bg-white p-4 rounded-lg border shadow-sm">
                <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            {/* Users Table */}
            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Permissions</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Login</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                                    <UserCog className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                                    No admin users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user._id} className={`hover:bg-gray-50 transition-colors ${!user.isActive ? 'opacity-50' : ''}`}>
                                    <TableCell>
                                        <div>
                                            <div className="font-semibold text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.role === 'SUPER_ADMIN' ? (
                                            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 flex items-center gap-1 w-fit">
                                                <ShieldCheck className="h-3 w-3" />
                                                Super Admin
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                                <Shield className="h-3 w-3" />
                                                Admin
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {user.role === 'SUPER_ADMIN' ? (
                                            <span className="text-sm text-gray-500 italic">All Permissions</span>
                                        ) : (
                                            <div className="flex flex-wrap gap-1 max-w-xs">
                                                {user.permissions?.slice(0, 3).map((perm: string) => (
                                                    <Badge key={perm} variant="secondary" className="text-xs">
                                                        {getPermissionLabel(perm as any)}
                                                    </Badge>
                                                ))}
                                                {user.permissions?.length > 3 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        +{user.permissions.length - 3} more
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {user.isActive ? (
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 flex items-center gap-1 w-fit">
                                                <ShieldAlert className="h-3 w-3" />
                                                Inactive
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {user.lastLogin ? (
                                            <span className="text-sm text-gray-600">
                                                {new Date(user.lastLogin).toLocaleDateString()}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-gray-400">Never</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/users/${user._id}`}>
                                                <Button size="sm" variant="ghost">
                                                    <Edit className="h-4 w-4 text-gray-500" />
                                                </Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleToggleActive(user._id, user.isActive)}
                                            >
                                                {user.isActive ? (
                                                    <ShieldAlert className="h-4 w-4 text-orange-500" />
                                                ) : (
                                                    <ShieldCheck className="h-4 w-4 text-green-500" />
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDelete(user._id)}
                                            >
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

            <div className="text-xs text-gray-500 text-right">
                Showing {users.length} admin user{users.length !== 1 ? 's' : ''}
            </div>
        </div>
    );
}

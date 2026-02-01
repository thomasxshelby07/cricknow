"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save, Shield } from "lucide-react";
import Link from "next/link";
import { getPermissionsByCategory } from "@/lib/permissions";
import { useSession } from "next-auth/react";

export default function EditAdminPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userId, setUserId] = useState<string>("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "ADMIN",
        permissions: [] as string[],
        isActive: true,
        createdBy: null as any,
        createdAt: "",
        lastLogin: null as string | null,
    });

    const permissionGroups = getPermissionsByCategory();

    useEffect(() => {
        params.then(({ id }) => {
            setUserId(id);
            fetchUser(id);
        });
    }, []);

    const fetchUser = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/users/${id}`);
            const json = await res.json();

            if (json.success) {
                const user = json.data;
                setFormData({
                    name: user.name || "",
                    email: user.email,
                    password: "",
                    role: user.role,
                    permissions: user.permissions || [],
                    isActive: user.isActive,
                    createdBy: user.createdBy,
                    createdAt: user.createdAt,
                    lastLogin: user.lastLogin,
                });
            } else {
                toast.error("Failed to load user");
                router.push("/admin/users");
            }
        } catch (error) {
            toast.error("Error loading user");
            router.push("/admin/users");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const updateData: any = {
                name: formData.name,
                role: formData.role,
                permissions: formData.role === 'SUPER_ADMIN' ? [] : formData.permissions,
                isActive: formData.isActive,
            };

            // Only include password if it's been changed
            if (formData.password) {
                updateData.password = formData.password;
            }

            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData),
            });

            const json = await res.json();

            if (json.success) {
                toast.success("Admin updated successfully");
                router.push("/admin/users");
            } else {
                toast.error(json.error || "Failed to update admin");
            }
        } catch (error) {
            toast.error("Error updating admin");
        } finally {
            setSaving(false);
        }
    };

    const handlePermissionToggle = (permission: string) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter(p => p !== permission)
                : [...prev.permissions, permission]
        }));
    };

    const isEditingSelf = session?.user?.id === userId;

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/users">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-dark flex items-center gap-2">
                        <Shield className="h-8 w-8" />
                        Edit Admin User
                    </h1>
                    <p className="text-gray-500 mt-1">Update admin permissions and details</p>
                </div>
            </div>

            {isEditingSelf && (
                <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="pt-6">
                        <p className="text-sm text-yellow-700">
                            ⚠️ You are editing your own account. You cannot change your own permissions.
                        </p>
                    </CardContent>
                </Card>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                        <CardDescription>
                            Created on {new Date(formData.createdAt).toLocaleDateString()}
                            {formData.createdBy && ` by ${formData.createdBy.name || formData.createdBy.email}`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="bg-gray-50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">New Password (leave blank to keep current)</Label>
                            <Input
                                id="password"
                                type="text"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Enter new password"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value) => setFormData({ ...formData, role: value, permissions: value === 'SUPER_ADMIN' ? [] : formData.permissions })}
                                disabled={isEditingSelf}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                                disabled={isEditingSelf}
                            />
                            <Label htmlFor="isActive" className="cursor-pointer">
                                Active (user can login)
                            </Label>
                        </div>

                        {formData.lastLogin && (
                            <div className="text-sm text-gray-500">
                                Last login: {new Date(formData.lastLogin).toLocaleString()}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Permissions */}
                {formData.role === 'ADMIN' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Permissions</CardTitle>
                            <CardDescription>
                                {isEditingSelf ? "You cannot edit your own permissions" : "Select what this admin can manage"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Content Permissions */}
                            <div>
                                <h3 className="font-semibold mb-3 text-gray-700">Content Management</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {permissionGroups.content.map((perm) => (
                                        <div key={perm.key} className="flex items-start space-x-2 p-3 rounded-lg border hover:bg-gray-50">
                                            <Checkbox
                                                id={perm.key}
                                                checked={formData.permissions.includes(perm.key)}
                                                onCheckedChange={() => handlePermissionToggle(perm.key)}
                                                disabled={isEditingSelf}
                                            />
                                            <div className="flex-1">
                                                <Label htmlFor={perm.key} className="cursor-pointer font-medium">
                                                    {perm.label}
                                                </Label>
                                                <p className="text-xs text-gray-500 mt-0.5">{perm.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Settings Permissions */}
                            <div>
                                <h3 className="font-semibold mb-3 text-gray-700">Settings</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {permissionGroups.settings.map((perm) => (
                                        <div key={perm.key} className="flex items-start space-x-2 p-3 rounded-lg border hover:bg-gray-50">
                                            <Checkbox
                                                id={perm.key}
                                                checked={formData.permissions.includes(perm.key)}
                                                onCheckedChange={() => handlePermissionToggle(perm.key)}
                                                disabled={isEditingSelf}
                                            />
                                            <div className="flex-1">
                                                <Label htmlFor={perm.key} className="cursor-pointer font-medium">
                                                    {perm.label}
                                                </Label>
                                                <p className="text-xs text-gray-500 mt-0.5">{perm.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {formData.role === 'SUPER_ADMIN' && (
                    <Card className="bg-purple-50 border-purple-200">
                        <CardContent className="pt-6">
                            <p className="text-sm text-purple-700">
                                <strong>Super Admin</strong> has full access to all features and permissions automatically.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Submit */}
                <div className="flex justify-end gap-3">
                    <Link href="/admin/users">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}

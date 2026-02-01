"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { getPermissionsByCategory } from "@/lib/permissions";

export default function CreateAdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "ADMIN",
        permissions: [] as string[],
        isActive: true,
    });

    const permissionGroups = getPermissionsByCategory();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const json = await res.json();

            if (json.success) {
                toast.success("Admin created successfully");
                router.push("/admin/users");
            } else {
                toast.error(json.error || "Failed to create admin");
            }
        } catch (error) {
            toast.error("Error creating admin");
        } finally {
            setLoading(false);
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

    const generatePassword = () => {
        const password = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12).toUpperCase();
        setFormData(prev => ({ ...prev, password }));
        toast.success("Password generated");
    };

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
                        <UserPlus className="h-8 w-8" />
                        Create New Admin
                    </h1>
                    <p className="text-gray-500 mt-1">Add a new admin user with specific permissions</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Enter the admin user's basic details</CardDescription>
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
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="admin@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password *</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="password"
                                    type="text"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Enter password"
                                />
                                <Button type="button" variant="outline" onClick={generatePassword}>
                                    Generate
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role *</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value) => setFormData({ ...formData, role: value, permissions: value === 'SUPER_ADMIN' ? [] : formData.permissions })}
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
                            />
                            <Label htmlFor="isActive" className="cursor-pointer">
                                Active (user can login)
                            </Label>
                        </div>
                    </CardContent>
                </Card>

                {/* Permissions */}
                {formData.role === 'ADMIN' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Permissions</CardTitle>
                            <CardDescription>Select what this admin can manage</CardDescription>
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
                    <Button type="submit" disabled={loading || !formData.email || !formData.password || (formData.role === 'ADMIN' && formData.permissions.length === 0)}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Create Admin
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}

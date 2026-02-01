"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

export default function SuperAdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Invalid credentials");
            setLoading(false);
        } else {
            // Verify user is super admin
            const response = await fetch('/api/auth/session');
            const session = await response.json();

            if (session?.user?.role === 'SUPER_ADMIN') {
                router.push("/admin/dashboard");
            } else {
                setError("Access denied. Super Admin credentials required.");
                setLoading(false);
                await signIn('credentials', { redirect: false }); // Sign out
            }
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-purple-900 via-gray-900 to-black">
            <Card className="w-[450px] border-purple-500/20 bg-gray-900/90 backdrop-blur">
                <CardHeader className="space-y-3 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 ring-2 ring-purple-500/20">
                        <Shield className="h-8 w-8 text-purple-400" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-white">Super Admin</CardTitle>
                    <CardDescription className="text-gray-400">
                        Restricted access - Super Admin credentials required
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-300">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-gray-800 border-gray-700 text-white"
                                placeholder="admin@cricknow.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-300">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-gray-800 border-gray-700 text-white"
                                placeholder="••••••••"
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded border border-red-500/20">{error}</p>}
                        <Button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign In as Super Admin"}
                        </Button>
                    </form>
                    <div className="mt-4 text-center">
                        <a href="/admin" className="text-sm text-gray-400 hover:text-purple-400">
                            Regular admin? Login here
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

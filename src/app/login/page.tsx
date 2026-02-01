"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserCog } from "lucide-react";

export default function AdminLoginPage() {
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
            console.log('✅ Login successful, checking session...');

            // Verify user is active
            const response = await fetch('/api/auth/session');
            const session = await response.json();

            if (session?.user?.isActive === false) {
                setError("Your account has been deactivated. Please contact super admin.");
                setLoading(false);
                return;
            }

            // Force a hard reload to ensure cookies/session are picked up
            window.location.href = "/admin/dashboard";
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-blue-900 via-gray-900 to-black">
            <Card className="w-[450px] border-blue-500/20 bg-gray-900/90 backdrop-blur">
                <CardHeader className="space-y-3 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 ring-2 ring-blue-500/20">
                        <UserCog className="h-8 w-8 text-blue-400" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-white">Admin Login</CardTitle>
                    <CardDescription className="text-gray-400">
                        Sign in to access the admin panel
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
                                placeholder="your.email@example.com"
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
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                    <div className="mt-4 text-center">
                        <a href="/superadmin" className="text-sm text-gray-400 hover:text-blue-400">
                            Super admin? Login here
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

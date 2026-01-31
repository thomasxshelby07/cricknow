"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function AdminTopbar() {
    const { data: session } = useSession();

    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm dark:bg-gray-900">
            <div className="flex items-center gap-4">
                {/* Mobile Toggle could go here */}
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm font-medium leading-none">{session?.user?.name || "Admin"}</p>
                    <p className="text-xs text-muted-foreground">{session?.user?.role || "ADMIN"}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {session?.user?.name?.[0] || "A"}
                </div>
            </div>
        </header>
    );
}

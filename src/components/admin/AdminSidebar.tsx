"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Globe,
    FileText,
    Newspaper,
    Gift,
    LayoutTemplate,
    Shield,
    Settings,
    LogOut,
    Gamepad2,
    List
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { isSuperAdmin, hasPermission } from "@/lib/permissions";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        permission: null // Always visible
    },
    {
        title: "Betting Sites",
        href: "/admin/sites",
        icon: Globe,
        permission: "manage_sites"
    },
    {
        title: "Blogs",
        href: "/admin/blogs",
        icon: FileText,
        permission: "manage_blogs"
    },
    {
        title: "News",
        href: "/admin/news",
        icon: Newspaper,
        permission: "manage_news"
    },
    {
        title: "Promotions",
        href: "/admin/promotions",
        icon: Gift,
        permission: "manage_promotions"
    },
    {
        title: "Coupons",
        href: "/admin/coupons",
        icon: Gift,
        permission: "manage_coupons"
    },
    {
        title: "Games",
        href: "/admin/games",
        icon: Gamepad2,
        permission: "manage_games"
    },
];

const systemItems = [
    {
        title: "Admins",
        href: "/admin/users",
        icon: Shield // Security Icon
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings // Config Icon
    }
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const isUserSuperAdmin = session?.user ? isSuperAdmin(session.user) : false;

    return (
        <div className="flex h-screen w-64 flex-col bg-neutral-dark text-white shadow-xl">
            <div className="flex h-16 items-center justify-center border-b border-gray-700 bg-neutral-dark/50">
                <h1 className="text-xl font-bold tracking-wider text-primary">CRICKNOW</h1>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-2">
                    {sidebarItems.map((item) => {
                        // Check if user has permission for this item
                        if (item.permission && session?.user) {
                            // Super admins can see everything
                            if (!isUserSuperAdmin && !hasPermission(session.user, item.permission as any)) {
                                return null;
                            }
                        }

                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10",
                                    isActive ? "bg-primary text-white" : "text-gray-300"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.title}
                            </Link>
                        );
                    })}

                    <div className="my-4 border-t border-gray-700" />
                    <p className="px-4 text-xs font-semibold uppercase text-gray-500">System</p>

                    {systemItems.map((item) => {
                        // Only show Admins menu to super admins
                        if (item.href === '/admin/users' && !isUserSuperAdmin) {
                            return null;
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10",
                                    pathname.startsWith(item.href) ? "bg-primary text-white" : "text-gray-300"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-gray-700 p-4">
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    );
}

"use client";

import { useSession } from "next-auth/react";
import { hasPermission, isSuperAdmin, Permission } from "@/lib/permissions";
import { ReactNode } from "react";

interface PermissionGuardProps {
    permission?: Permission;
    requireSuperAdmin?: boolean;
    fallback?: ReactNode;
    children: ReactNode;
}

/**
 * Component to conditionally render content based on user permissions
 * Usage:
 * <PermissionGuard permission="manage_news">
 *   <Button>Create News</Button>
 * </PermissionGuard>
 */
export function PermissionGuard({
    permission,
    requireSuperAdmin = false,
    fallback = null,
    children
}: PermissionGuardProps) {
    const { data: session } = useSession();

    if (!session?.user) {
        return <>{fallback}</>;
    }

    // Check super admin requirement
    if (requireSuperAdmin && !isSuperAdmin(session.user)) {
        return <>{fallback}</>;
    }

    // Check specific permission
    if (permission && !hasPermission(session.user, permission)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

/**
 * Hook to check permissions in components
 */
export function usePermissions() {
    const { data: session } = useSession();

    return {
        hasPermission: (permission: Permission) =>
            session?.user ? hasPermission(session.user, permission) : false,
        isSuperAdmin: () =>
            session?.user ? isSuperAdmin(session.user) : false,
        permissions: session?.user?.permissions || [],
        user: session?.user,
    };
}

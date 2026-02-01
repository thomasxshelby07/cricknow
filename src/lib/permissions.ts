// Permission management utilities for role-based access control

export type Permission =
    | 'manage_news'
    | 'manage_blogs'
    | 'manage_games'
    | 'manage_sites'
    | 'manage_coupons'
    | 'manage_promotions'
    | 'manage_pages'
    | 'manage_home_config'
    | 'manage_admins';

export interface PermissionInfo {
    key: Permission;
    label: string;
    description: string;
    category: 'content' | 'settings' | 'admin';
}

// All available permissions with metadata
export const ALL_PERMISSIONS: PermissionInfo[] = [
    {
        key: 'manage_news',
        label: 'Manage News',
        description: 'Create, edit, and delete news articles',
        category: 'content',
    },
    {
        key: 'manage_blogs',
        label: 'Manage Blogs',
        description: 'Create, edit, and delete blog posts',
        category: 'content',
    },
    {
        key: 'manage_games',
        label: 'Manage Games',
        description: 'Create, edit, and delete games',
        category: 'content',
    },
    {
        key: 'manage_sites',
        label: 'Manage Betting Sites',
        description: 'Create, edit, and delete betting sites',
        category: 'content',
    },
    {
        key: 'manage_coupons',
        label: 'Manage Coupons',
        description: 'Create, edit, and delete coupons',
        category: 'content',
    },
    {
        key: 'manage_promotions',
        label: 'Manage Promotions',
        description: 'Create, edit, and delete promotional banners',
        category: 'content',
    },
    {
        key: 'manage_pages',
        label: 'Manage Pages',
        description: 'Create and edit custom pages',
        category: 'settings',
    },
    {
        key: 'manage_home_config',
        label: 'Manage Homepage',
        description: 'Edit homepage configuration and settings',
        category: 'settings',
    },
    {
        key: 'manage_admins',
        label: 'Manage Admins',
        description: 'Create and manage admin users (Super Admin only)',
        category: 'admin',
    },
];

// Get permissions grouped by category
export function getPermissionsByCategory() {
    return {
        content: ALL_PERMISSIONS.filter(p => p.category === 'content'),
        settings: ALL_PERMISSIONS.filter(p => p.category === 'settings'),
        admin: ALL_PERMISSIONS.filter(p => p.category === 'admin'),
    };
}

// Check if user has a specific permission
export function hasPermission(user: any, permission: Permission): boolean {
    if (!user) return false;

    // Super admins have all permissions
    if (user.role === 'SUPER_ADMIN') return true;

    // Check if user has the specific permission
    return user.permissions?.includes(permission) || false;
}

// Check if user is super admin
export function isSuperAdmin(user: any): boolean {
    return user?.role === 'SUPER_ADMIN';
}

// Check if user has any of the specified permissions
export function hasAnyPermission(user: any, permissions: Permission[]): boolean {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;

    return permissions.some(permission => user.permissions?.includes(permission));
}

// Check if user has all of the specified permissions
export function hasAllPermissions(user: any, permissions: Permission[]): boolean {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;

    return permissions.every(permission => user.permissions?.includes(permission));
}

// Get all permissions for a user
export function getUserPermissions(user: any): Permission[] {
    if (!user) return [];
    if (user.role === 'SUPER_ADMIN') {
        return ALL_PERMISSIONS.map(p => p.key);
    }
    return user.permissions || [];
}

// Validate permissions array
export function validatePermissions(permissions: string[]): boolean {
    const validPermissions = ALL_PERMISSIONS.map(p => p.key);
    return permissions.every(p => validPermissions.includes(p as Permission));
}

// Get permission label
export function getPermissionLabel(permission: Permission): string {
    return ALL_PERMISSIONS.find(p => p.key === permission)?.label || permission;
}

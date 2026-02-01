import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import { isSuperAdmin, validatePermissions } from "@/lib/permissions";
import bcrypt from "bcryptjs";

// GET - Get single admin user details (Super Admin only)
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !isSuperAdmin(session.user)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await connectToDatabase();
        const { id } = await params;

        const user = await User.findById(id)
            .select('-passwordHash')
            .populate('createdBy', 'name email')
            .lean();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: user });
    } catch (error: any) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH - Update admin user (Super Admin only)
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !isSuperAdmin(session.user)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await connectToDatabase();
        const { id } = await params;

        // Prevent editing own permissions
        if (session.user.id === id) {
            return NextResponse.json({
                error: "Cannot edit your own permissions"
            }, { status: 400 });
        }

        const body = await req.json();
        const { name, role, permissions, isActive, password } = body;

        const updateData: any = {};

        if (name !== undefined) updateData.name = name;
        if (role !== undefined) updateData.role = role;
        if (isActive !== undefined) updateData.isActive = isActive;

        // Handle permissions
        if (permissions !== undefined) {
            if (role === 'SUPER_ADMIN') {
                updateData.permissions = [];
            } else {
                if (!validatePermissions(permissions)) {
                    return NextResponse.json({ error: "Invalid permissions" }, { status: 400 });
                }
                updateData.permissions = permissions;
            }
        }

        // Handle password update
        if (password) {
            updateData.passwordHash = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-passwordHash');

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: user });
    } catch (error: any) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Deactivate admin user (Super Admin only)
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !isSuperAdmin(session.user)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await connectToDatabase();
        const { id } = await params;

        // Prevent deleting self
        if (session.user.id === id) {
            return NextResponse.json({
                error: "Cannot delete yourself"
            }, { status: 400 });
        }

        // Check if this is the last super admin
        const user = await User.findById(id);
        if (user?.role === 'SUPER_ADMIN') {
            const superAdminCount = await User.countDocuments({
                role: 'SUPER_ADMIN',
                isActive: true
            });

            if (superAdminCount <= 1) {
                return NextResponse.json({
                    error: "Cannot delete the last Super Admin"
                }, { status: 400 });
            }
        }

        // Soft delete by setting isActive to false
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        ).select('-passwordHash');

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedUser });
    } catch (error: any) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import { isSuperAdmin, validatePermissions } from "@/lib/permissions";
import bcrypt from "bcryptjs";

// GET - List all admin users (Super Admin only)
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !isSuperAdmin(session.user)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("q");

        let filter: any = {};
        if (search) {
            filter = {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            };
        }

        const users = await User.find(filter)
            .select('-passwordHash')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ success: true, data: users });
    } catch (error: any) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Create new admin user (Super Admin only)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !isSuperAdmin(session.user)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await connectToDatabase();

        const body = await req.json();
        const { email, password, name, role, permissions, isActive } = body;

        // Validation
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        if (role === 'SUPER_ADMIN' && permissions && permissions.length > 0) {
            return NextResponse.json({
                error: "Super Admin doesn't need specific permissions"
            }, { status: 400 });
        }

        if (role === 'ADMIN' && (!permissions || permissions.length === 0)) {
            return NextResponse.json({
                error: "Admin must have at least one permission"
            }, { status: 400 });
        }

        // Validate permissions
        if (permissions && !validatePermissions(permissions)) {
            return NextResponse.json({ error: "Invalid permissions" }, { status: 400 });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            email,
            passwordHash,
            name: name || email.split('@')[0],
            role: role || 'ADMIN',
            permissions: role === 'SUPER_ADMIN' ? [] : (permissions || []),
            isActive: isActive !== undefined ? isActive : true,
            createdBy: session.user.id,
        });

        // Return user without password
        const userResponse = {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            permissions: user.permissions,
            isActive: user.isActive,
            createdBy: user.createdBy,
            createdAt: user.createdAt,
        };

        return NextResponse.json({ success: true, data: userResponse }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH - Bulk update users (Super Admin only)
export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !isSuperAdmin(session.user)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await connectToDatabase();

        const { updates } = await req.json();

        if (!Array.isArray(updates)) {
            return NextResponse.json({ error: "Updates must be an array" }, { status: 400 });
        }

        const updatePromises = updates.map(({ id, isActive }) =>
            User.findByIdAndUpdate(id, { isActive }, { new: true })
        );

        await Promise.all(updatePromises);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error bulk updating users:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        // Security: Only allow this in development or with a secret key
        const { secret } = await request.json();

        if (secret !== 'create-super-admin-2026') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectToDatabase();

        const email = 'admin@cricknow.com';
        const password = 'adminpassword123';

        // Check if super admin already exists
        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json({
                success: true,
                message: 'Super Admin already exists',
                credentials: {
                    email,
                    password,
                }
            });
        }

        // Create super admin
        const passwordHash = await bcrypt.hash(password, 10);

        await User.create({
            email,
            passwordHash,
            name: 'Super Admin',
            role: 'SUPER_ADMIN',
            permissions: [],
            isActive: true,
        });

        return NextResponse.json({
            success: true,
            message: 'Super Admin created successfully!',
            credentials: {
                email,
                password,
            }
        });
    } catch (error: any) {
        console.error('Error creating super admin:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create super admin' },
            { status: 500 }
        );
    }
}

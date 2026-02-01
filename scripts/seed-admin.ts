import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../src/lib/db';
import { User } from '../src/models/User';

async function seed() {
    await connectToDatabase();

    const email = process.env.SUPER_ADMIN_EMAIL || 'admin@cricknow.com';
    const password = process.env.SUPER_ADMIN_PASSWORD || 'adminpassword123';

    if (!process.env.SUPER_ADMIN_EMAIL || !process.env.SUPER_ADMIN_PASSWORD) {
        console.warn('⚠️  Warning: Using default credentials. Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in .env');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const existing = await User.findOne({ email });
    if (existing) {
        console.log('Super Admin already exists');
        process.exit(0);
    }

    await User.create({
        email,
        passwordHash,
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
    });

    console.log(`Super Admin created: ${email} / ${password}`);
    process.exit(0);
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});

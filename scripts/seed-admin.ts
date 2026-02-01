import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../src/lib/db';
import { User } from '../src/models/User';

async function seed() {
    await connectToDatabase();

    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;

    if (!email || !password) {
        console.error('❌ Error: SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in .env file');
        console.error('Please add these variables to your .env file and try again.');
        process.exit(1);
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

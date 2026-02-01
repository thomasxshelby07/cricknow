// Script to create the first Super Admin user
// Run this with: node scripts/create-super-admin.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
    role: {
        type: String,
        enum: ['SUPER_ADMIN', 'ADMIN'],
        default: 'ADMIN',
        required: true,
    },
    permissions: {
        type: [String],
        default: [],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    lastLogin: { type: Date },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createSuperAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if super admin already exists
        const existingAdmin = await User.findOne({ role: 'SUPER_ADMIN' });
        if (existingAdmin) {
            console.log('⚠️  Super Admin already exists:', existingAdmin.email);
            process.exit(0);
        }

        // Create super admin
        const email = 'admin@cricknow.com'; // Change this
        const password = 'Admin@123'; // Change this
        const name = 'Super Admin';

        const passwordHash = await bcrypt.hash(password, 10);

        const superAdmin = await User.create({
            email,
            passwordHash,
            name,
            role: 'SUPER_ADMIN',
            permissions: [],
            isActive: true,
            createdBy: null,
        });

        console.log('✅ Super Admin created successfully!');
        console.log('📧 Email:', email);
        console.log('🔑 Password:', password);
        console.log('⚠️  Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

createSuperAdmin();

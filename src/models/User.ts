import mongoose from 'mongoose';

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
    lastLogin: { type: Date },
}, { timestamps: true });

// Prevent re-compilation error in Next.js hot reload
export const User = mongoose.models.User || mongoose.model('User', UserSchema);

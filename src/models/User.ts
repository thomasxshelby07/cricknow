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
    permissions: {
        type: [String],
        default: [],
        // Available permissions: manage_news, manage_blogs, manage_games, 
        // manage_sites, manage_coupons, manage_promotions, manage_pages, 
        // manage_home_config, manage_admins
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

// Prevent re-compilation error in Next.js hot reload
export const User = mongoose.models.User || mongoose.model('User', UserSchema);


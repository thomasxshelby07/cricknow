import mongoose from 'mongoose';

export const SEOSchema = new mongoose.Schema({
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    focusKeywords: [{ type: String }],
    canonicalUrl: { type: String, trim: true },
    structuredData: { type: String }, // Custom JSON-LD
    noIndex: { type: Boolean, default: false },
    noFollow: { type: Boolean, default: false },
}, { _id: false });

export const VisibilitySchema = new mongoose.Schema({
    showOnHome: { type: Boolean, default: false },
    showOnMenu: { type: Boolean, default: false },
    // Additional context-specific flags can be mixed in at model level if needed,
    // but these are the consistent bases.
    status: {
        type: String,
        enum: ['draft', 'published', 'archived', 'hidden'],
        default: 'draft',
        required: true,
    },
    displayOrder: { type: Number, default: 0 }, // 0 = default, higher = higher priority (or handled by sort logic)
}, { _id: false });

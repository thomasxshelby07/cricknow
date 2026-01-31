import mongoose from 'mongoose';
import { SEOSchema, VisibilitySchema } from './schemas';

const PromotionSchema = new mongoose.Schema({
    title: { type: String, required: true }, // e.g., "IPL 2026 Special"
    slug: { type: String, required: true, unique: true, index: true },

    type: {
        type: String,
        enum: ['welcome', 'deposit', 'freebet', 'event', 'ad_banner'],
        default: 'welcome'
    },

    // Linkage
    siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'BettingSite', required: false },

    // Offer Details
    bonusCode: { type: String },
    bonusAmount: { type: String },
    ctaText: { type: String, default: 'Claim Now' },
    redirectUrl: { type: String }, // Optional override of site link
    description: { type: String }, // Short details

    // Ad Banner Specifics
    images: {
        vertical: { type: String },
        horizontal: { type: String }
    },

    // Visibility & SEO
    seo: { type: SEOSchema, default: {} },
    visibility: { type: VisibilitySchema, default: {} },

    // Contexts
    showOnOffers: { type: Boolean, default: true },
    showOnCasino: { type: Boolean, default: false },
    showOnCricket: { type: Boolean, default: false },

    // Advanced Display Settings
    displaySettings: {
        mode: { type: String, enum: ['all', 'specific'], default: 'all' },
        includedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
        includedNews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'News' }]
    },

}, { timestamps: true });

// FORCE RECOMPILE IN DEV to pick up schema changes (siteId required: false)
// This prevents the "ValidatorError: Path `siteId` is required" after schema update
if (process.env.NODE_ENV === 'development' && mongoose.models.Promotion) {
    delete mongoose.models.Promotion;
}

export const Promotion = mongoose.models.Promotion || mongoose.model('Promotion', PromotionSchema);

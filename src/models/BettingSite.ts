import mongoose from 'mongoose';
import { SEOSchema, VisibilitySchema } from './schemas';

const BettingSiteSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    type: {
        type: String,
        enum: ['betting', 'casino', 'cricket'],
        required: true
    },

    // Content
    shortDescription: { type: String }, // For cards
    fullDescription: { type: String }, // Rich text review
    rating: { type: Number, min: 0, max: 10, default: 0 },
    badges: [{ type: String }], // e.g., "Verified", "Licensed"

    // Media
    logoUrl: { type: String },
    coverImageUrl: { type: String },

    // Promotion Block (Default offer attached to site)
    mainBonusText: { type: String }, // e.g., "100% up to ₹10,000"
    joiningBonus: { type: String },
    redeemBonus: { type: String, default: "" },
    reDepositBonus: { type: String, default: "" },
    otherBonus: { type: String, default: "" },
    affiliateLink: { type: String, required: true }, // The main money link
    ctaText: { type: String, default: 'Claim Bonus' },

    // Visibility & SEO
    seo: { type: SEOSchema, default: {} },
    visibility: {
        type: VisibilitySchema,
        default: {}
    },

    // Specific Visibility Flags (Extended)
    showOnOffers: { type: Boolean, default: false },
    showOnCasino: { type: Boolean, default: false },
    showOnCricket: { type: Boolean, default: false },
    showOnNewsSidebar: { type: Boolean, default: false },
    showOnBlogSidebar: { type: Boolean, default: false }, // New flag for Blog Page Sidebar
    isFeatured: { type: Boolean, default: false },

    // Single Page Content
    reviewTitle: { type: String }, // e.g. "Parimatch Review 2024"
    reviewContent: { type: String }, // HTML/Rich Text
    pros: [{ type: String }],
    cons: [{ type: String }],
    gallery: [{ type: String }], // Screenshots

    // Dynamic Sections
    userReviews: [{
        user: String,
        rating: Number,
        date: String,
        country: String,
        comment: String
    }],

    seoSections: [{
        title: String,
        content: String, // Rich Text
        image: String // Section Image
    }],

    faqs: [{
        question: String,
        answer: String
    }],

    // Detailed Ratings
    ratings: {
        overall: { type: Number, default: 0 },
        trust: { type: Number, default: 0 },
        games: { type: Number, default: 0 },
        bonus: { type: Number, default: 0 },
        support: { type: Number, default: 0 },
    },

    // Meta Info
    foundedYear: { type: String },
    owner: { type: String },
    licenses: [{ type: String }], // Comma separated or array

    // New Fields for Enhanced SEO & content
    customH1: { type: String },
    lastUpdated: { type: Date },
    comparisonContent: { type: String },

    internalLinks: [{
        title: String,
        url: String,
        type: { type: String, enum: ['blog', 'news', 'comparison', 'other'], default: 'other' }
    }],

}, { timestamps: true });

export const BettingSite = mongoose.models.BettingSite || mongoose.model('BettingSite', BettingSiteSchema);

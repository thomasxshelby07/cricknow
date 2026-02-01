import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a game title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide a short description'],
        maxlength: [300, 'Description cannot be more than 300 characters'],
    },
    content: {
        type: String,
        required: [true, 'Please provide game content'], // Rich Text
    },
    coverImage: {
        type: String,
        required: [true, 'Please provide a cover image'],
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        trim: true,
        // Removed strict enum to allow dynamic categories
        default: 'Casino'
    },
    provider: {
        type: String,
        trim: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    playLink: {
        type: String,
        trim: true,
    },
    demoLink: {
        type: String,
        trim: true,
    },
    screenshots: [String],
    visibility: {
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft'
        },
        featured: {
            type: Boolean,
            default: false
        },
        displayOrder: {
            type: Number,
            default: 0
        }
    },
    seo: {
        // Basic Meta
        metaTitle: String,
        metaDescription: String,
        customH1: String, // Custom H1 for SEO

        // Keywords
        focusKeywords: [String], // Primary focus keywords
        keywords: [String], // Additional keywords

        // URLs
        canonicalUrl: String,

        // Indexing
        noIndex: { type: Boolean, default: false },
        noFollow: { type: Boolean, default: false },

        // Open Graph
        ogTitle: String,
        ogDescription: String,
        ogImage: String,

        // Twitter Card
        twitterTitle: String,
        twitterDescription: String,
        twitterImage: String,

        // Structured Data (JSON-LD)
        structuredData: mongoose.Schema.Types.Mixed, // Custom JSON-LD
    },
    // Related Content
    relatedCasinos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BettingSite' }],
    relatedCoupons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' }],
    relatedNews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'News' }],
    relatedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],

    // Extra Sections
    faqs: [{
        question: String,
        answer: String
    }],
    pros: [String],
    cons: [String]
}, {
    timestamps: true // Enable timestamps
});

// FORCE RECOMPILE IN DEV to pick up schema changes
if (process.env.NODE_ENV === 'development' && mongoose.models.Game) {
    delete mongoose.models.Game;
}

export default mongoose.models.Game || mongoose.model('Game', GameSchema);

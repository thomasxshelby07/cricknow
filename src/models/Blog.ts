import mongoose from 'mongoose';
import { SEOSchema, VisibilitySchema } from './schemas';

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },

    category: {
        type: String,
        enum: ['betting', 'casino', 'cricket', 'guides', 'news'], // 'news' might be separate model but category allows flexibility
        default: 'guides'
    },

    content: { type: String }, // HTML/Markdown
    excerpt: { type: String },
    coverImageUrl: { type: String },

    // Internal Linking (The "Silo" logic)
    relatedSites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BettingSite' }],
    relatedOffers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Promotion' }],
    relatedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
    relatedNews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'News' }],
    relatedCoupons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' }],

    // Visibility & SEO
    seo: { type: SEOSchema, default: {} },
    visibility: { type: VisibilitySchema, default: {} },

    // Advanced SEO & Schema
    customH1: { type: String },
    lastUpdated: { type: Date },
    faqs: [{
        question: { type: String },
        answer: { type: String }
    }],

    isFeatured: { type: Boolean, default: false },

}, { timestamps: true });

export const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

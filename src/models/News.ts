import mongoose from 'mongoose';
import { SEOSchema, VisibilitySchema } from './schemas';

const NewsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },

    summary: { type: String },
    content: { type: String }, // Short form content
    coverImageUrl: { type: String },

    // Linking
    relatedSites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BettingSite' }],
    relatedNews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'News' }],
    relatedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],

    // Smart SEO Fields
    customH1: { type: String },
    lastUpdated: { type: Date },
    internalLinks: [{
        title: String,
        url: String,
        type: { type: String, enum: ['blog', 'news', 'comparison', 'other'], default: 'other' }
    }],
    faqs: [{
        question: String,
        answer: String
    }],

    // Visibility & SEO
    seo: { type: SEOSchema, default: {} },
    visibility: { type: VisibilitySchema, default: {} },

    // Content & Classification
    category: {
        type: String,
        enum: ['Cricket Betting', 'Casino News', 'Platform Updates', 'General', 'Betting News'],
        default: 'General'
    },
    priority: { type: Number, default: 0 }, // For manual sorting of featured items

    isFeatured: { type: Boolean, default: false },

}, { timestamps: true });

export const News = mongoose.models.News || mongoose.model('News', NewsSchema);

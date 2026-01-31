import mongoose from 'mongoose';
import { SEOSchema } from './schemas';

const SectionSchema = new mongoose.Schema({
    id: { type: String, required: true }, // Client-side UUID for Drag & Drop
    component: { type: String, required: true }, // e.g., 'Hero', 'SiteList'
    isVisible: { type: Boolean, default: true },
    props: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { _id: false });

const PageSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },

    type: {
        type: String,
        enum: ['system', 'extra'],
        default: 'extra',
    },

    // The Layout (Order is determined by array index)
    sections: [SectionSchema],

    seo: { type: SEOSchema, default: {} },
    status: {
        type: String,
        enum: ['published', 'draft', 'archived'],
        default: 'draft'
    }

}, { timestamps: true });

export const Page = mongoose.models.Page || mongoose.model('Page', PageSchema);

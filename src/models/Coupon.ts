import mongoose from 'mongoose';
import { SEOSchema, VisibilitySchema } from './schemas';

const CouponSchema = new mongoose.Schema({
    // Basic Info
    name: { type: String, required: true }, // Coupon name
    slug: { type: String, required: true, unique: true, index: true },
    offer: { type: String, required: true }, // Offer description

    // Coupon Details
    couponCode: { type: String }, // Promo code
    bonusAmount: { type: String }, // e.g., "500% Bonus"

    // CTA
    buttonText: { type: String, required: true, default: 'Claim Now' },
    redirectLink: { type: String, required: true }, // Affiliate link

    // Image
    imageUrl: { type: String }, // Banner image

    // Page Visibility
    showOnHome: { type: Boolean, default: false },
    showOnBlog: { type: Boolean, default: false },
    showOnNews: { type: Boolean, default: false },
    showOnBonuses: { type: Boolean, default: true },

    // SEO & Visibility
    seo: { type: SEOSchema, default: {} },
    visibility: { type: VisibilitySchema, default: {} },

}, { timestamps: true });

// FORCE RECOMPILE IN DEV
if (process.env.NODE_ENV === 'development' && mongoose.models.Coupon) {
    delete mongoose.models.Coupon;
}

export const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);

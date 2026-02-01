import mongoose from 'mongoose';

const GameCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a category name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    slug: {
        type: String,
        unique: true,
        required: true, // Auto-generated from name usually
        lowercase: true,
        trim: true,
    },
    description: {
        type: String,
        maxlength: [200, 'Description cannot be more than 200 characters'],
    },
    iconUrl: {
        type: String,
        // Optional: User can upload an icon/image
    },
    linkPath: {
        type: String,
        // Optional: If this category redirects to a specific page (e.g. /online-casino)
        default: ""
    },
    displayOrder: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.models.GameCategory || mongoose.model('GameCategory', GameCategorySchema);

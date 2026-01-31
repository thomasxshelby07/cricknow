import mongoose from 'mongoose';

const SectionConfigSchema = new mongoose.Schema({
    isVisible: { type: Boolean, default: true },
    selectedIds: [{ type: mongoose.Schema.Types.ObjectId, refPath: 'modelName' }],
    displayOrder: { type: Number, default: 0 },
}, { _id: false });

const HomePageConfigSchema = new mongoose.Schema({
    // Singleton ID check
    isDefault: { type: Boolean, default: true, unique: true },

    bettingSites: {
        type: SectionConfigSchema,
        default: { isVisible: true, selectedIds: [] }
    },

    blogs: {
        type: SectionConfigSchema,
        default: { isVisible: true, selectedIds: [] }
    },

    news: {
        type: SectionConfigSchema,
        default: { isVisible: true, selectedIds: [] }
    },

    // Metadata
    lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

}, { timestamps: true });

// Ensure only one document exists
HomePageConfigSchema.pre('save', async function () {
    if (this.isNew) {
        const count = await mongoose.models.HomePageConfig.countDocuments();
        if (count > 0) {
            throw new Error('HomePageConfig already exists. Use update instead.');
        }
    }
});

export const HomePageConfig = mongoose.models.HomePageConfig || mongoose.model('HomePageConfig', HomePageConfigSchema);

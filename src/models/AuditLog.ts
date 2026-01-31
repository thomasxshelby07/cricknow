import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Email or ID
    action: { type: String, required: true }, // CREATE, UPDATE, DELETE, PUBLISH
    targetModel: { type: String, required: true }, // Blog, Site
    targetId: { type: String }, // ObjectId
    details: { type: mongoose.Schema.Types.Mixed }, // Changed fields
}, { timestamps: true });

export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);

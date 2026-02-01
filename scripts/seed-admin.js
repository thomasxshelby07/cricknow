require('dotenv/config');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const connectToDatabase = async () => {
    const uri = process.env.MONGO_URI;
    const dbName = process.env.MONGO_DB_NAME;

    if (!uri) {
        throw new Error('MONGO_URI is not defined');
    }

    if (mongoose.connection.readyState === 1) {
        return;
    }

    await mongoose.connect(uri, {
        dbName: dbName || 'cricknowbot',
    });

    console.log('Connected to MongoDB');
};

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: ['SUPER_ADMIN', 'ADMIN'],
    },
    permissions: [String],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seed() {
    try {
        await connectToDatabase();

        const email = 'admin@cricknow.com';
        const password = 'adminpassword123';
        const passwordHash = await bcrypt.hash(password, 10);

        const existing = await User.findOne({ email });
        if (existing) {
            console.log('✅ Super Admin already exists');
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
            process.exit(0);
        }

        await User.create({
            email,
            passwordHash,
            name: 'Super Admin',
            role: 'SUPER_ADMIN',
            permissions: [],
            isActive: true,
        });

        console.log('✅ Super Admin created successfully!');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('\n🚀 You can now login on Vercel with these credentials');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

seed();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local to ensure we get the URI without external dependency issues
try {
    const envPath = path.resolve(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.trim();
            }
        });
    }
} catch (e) {
    console.log('Could not read .env.local', e);
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI not found in .env.local');
    // console.log('Current env keys:', Object.keys(process.env)); 
    process.exit(1);
}

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
    role: {
        type: String,
        enum: ['SUPER_ADMIN', 'ADMIN'],
        default: 'ADMIN',
        required: true,
    },
    lastLogin: { type: Date },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const email = 'admin@cricknow.com';
        const password = 'admin123';
        const name = 'Super Admin';

        // Check if exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists. Updating role to SUPER_ADMIN...');
            existingUser.role = 'SUPER_ADMIN';
            existingUser.passwordHash = await bcrypt.hash(password, 10);
            await existingUser.save();
            console.log('User updated successfully.');
        } else {
            console.log('Creating new SUPER_ADMIN...');
            const passwordHash = await bcrypt.hash(password, 10);
            await User.create({
                email,
                name,
                passwordHash,
                role: 'SUPER_ADMIN'
            });
            console.log('User created successfully.');
        }

        console.log(`\n---------------------------------`);
        console.log(`Login Credentials:`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log(`---------------------------------\n`);

    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await mongoose.disconnect();
    }
}

createAdmin();

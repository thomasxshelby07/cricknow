import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { HomePageConfig } from '@/models/HomePageConfig';

// GET: Fetch config (create default if missing)
export async function GET() {
    try {
        await connectToDatabase();

        let config = await HomePageConfig.findOne({ isDefault: true });

        if (!config) {
            config = await HomePageConfig.create({ isDefault: true });
        }

        return NextResponse.json(config);
    } catch (error) {
        console.error('Error fetching home config:', error);
        return NextResponse.json(
            { error: 'Failed to fetch home configuration' },
            { status: 500 }
        );
    }
}

// PUT: Update config
export async function PUT(request: Request) {
    try {
        await connectToDatabase();
        const data = await request.json();

        // Remove immutable fields
        delete data._id;
        delete data.createdAt;
        delete data.updatedAt;
        delete data.isDefault;

        const config = await HomePageConfig.findOneAndUpdate(
            { isDefault: true },
            { $set: data },
            { new: true, upsert: true, runValidators: true }
        );

        return NextResponse.json(config);
    } catch (error) {
        console.error('Error updating home config:', error);
        return NextResponse.json(
            { error: 'Failed to update home configuration' },
            { status: 500 }
        );
    }
}

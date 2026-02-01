import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Readable } from "stream";

// Ensure Node.js runtime for stream/fs operations
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Check if Cloudinary Secret is available (required for Cloudinary upload)
        // We use process.env.CLOUDINARY_API_SECRET directly or assume it's loaded in lib/cloudinary
        const hasCloudinarySecret = !!process.env.CLOUDINARY_API_SECRET;

        // PRIORITIZE CLOUDINARY if secret is present OR if we are in PRODUCTION (where local FS fails)
        // If in Production but no secret, we try Cloudinary anyway so it fails explicitly with "Missing Secret" 
        // rather than failing silently with "Read-only file system".
        const useCloudinary = hasCloudinarySecret || process.env.NODE_ENV === 'production';

        if (useCloudinary) {
            console.log("☁️ Attempting Cloudinary Upload...");

            if (!hasCloudinarySecret) {
                console.error("❌ MISSING CLOUDINARY_API_SECRET. Upload will likely fail.");
                return NextResponse.json({
                    error: "Server Configuration Error: Missing Cloudinary API Secret. Please add CLOUDINARY_API_SECRET to environment variables."
                }, { status: 500 });
            }

            // Upload via Stream
            const uploadResult: any = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "cricknow_uploads",
                        resource_type: "auto", // Auto-detect image/video
                    },
                    (error, result) => {
                        if (error) {
                            console.error("❌ Cloudinary Upload Error:", error);
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );

                // Convert buffer to stream and pipe
                const stream = Readable.from(buffer);
                stream.pipe(uploadStream);
            });

            console.log("✅ Cloudinary Upload Success:", uploadResult.secure_url);
            return NextResponse.json({ success: true, url: uploadResult.secure_url });

        } else {
            // FALLBACK: Local Filesystem (Only valid for Localhost)
            console.log("📂 Using Local Filesystem Storage (Dev Only)...");

            const filename = `${uuidv4()}-${file.name.replace(/\s/g, '-')}`;
            const uploadDir = path.join(process.cwd(), "public/uploads");

            // Ensure directory exists
            try {
                await mkdir(uploadDir, { recursive: true });
            } catch (e) {
                // Ignore if exists
            }

            const filepath = path.join(uploadDir, filename);
            await writeFile(filepath, buffer);

            const url = `/uploads/${filename}`;
            console.log("✅ Local Upload Success:", url);

            return NextResponse.json({ success: true, url });
        }

    } catch (error: any) {
        console.error("❌ Upload API Critical Error:", error);
        return NextResponse.json({
            error: "Upload failed: " + (error?.message || "Unknown error")
        }, { status: 500 });
    }
}

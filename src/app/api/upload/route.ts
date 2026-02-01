import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${uuidv4()}-${file.name.replace(/\s/g, '-')}`;

        const uploadDir = path.join(process.cwd(), "public/uploads");

        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore error if directory exists
        }

        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        const url = `/uploads/${filename}`;

        return NextResponse.json({ success: true, url });
    } catch (error: any) {
        console.error("❌ Upload API Error:", error);
        // Log environment details for debugging
        console.error("DEBUG INFO:", {
            cwd: process.cwd(),
            nodeEnv: process.env.NODE_ENV,
            errorMessage: error?.message,
            stack: error?.stack
        });
        return NextResponse.json({ error: "Upload failed: " + (error?.message || "Unknown error") }, { status: 500 });
    }
}

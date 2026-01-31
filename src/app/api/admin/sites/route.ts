import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { BettingSite } from "@/models/BettingSite";
import { slugify } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        let body;
        try {
            body = await req.json();
        } catch (e) {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        // Basic Validation
        if (!body.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
        if (!body.type) return NextResponse.json({ error: "Type is required" }, { status: 400 });

        // Auto-generate slug if empty
        let finalSlug = body.slug ? slugify(body.slug) : slugify(body.name);

        // Ensure slug is not empty after slugification
        if (!finalSlug) {
            return NextResponse.json({ error: "Could not generate a valid slug from name. Please provide a slug manually." }, { status: 400 });
        }

        // Slug Uniqueness Check
        const existing = await BettingSite.findOne({ slug: finalSlug });
        if (existing) {
            return NextResponse.json({ error: `Slug '${finalSlug}' already exists. Please choose another.` }, { status: 400 });
        }

        console.log("Creating new Betting Site:", { name: body.name, slug: finalSlug });

        // Explicitly map fields to avoid pollution or missing fields
        const newSiteData = {
            name: body.name,
            slug: finalSlug,
            type: body.type,
            shortDescription: body.shortDescription,
            fullDescription: body.fullDescription,
            rating: body.rating,
            badges: body.badges,
            logoUrl: body.logoUrl,
            coverImageUrl: body.coverImageUrl,
            mainBonusText: body.mainBonusText,
            joiningBonus: body.joiningBonus,
            redeemBonus: body.redeemBonus,
            reDepositBonus: body.reDepositBonus,
            otherBonus: body.otherBonus,
            affiliateLink: body.affiliateLink,
            ctaText: body.ctaText,
            seo: body.seo,
            visibility: body.visibility,
            showOnOffers: body.showOnOffers,
            showOnCasino: body.showOnCasino,
            showOnCricket: body.showOnCricket,
            isFeatured: body.isFeatured,

            // Content & Extra Fields
            reviewTitle: body.reviewTitle,
            reviewContent: body.reviewContent,
            pros: body.pros,
            cons: body.cons,
            gallery: body.gallery,
            userReviews: body.userReviews,
            seoSections: body.seoSections,
            faqs: body.faqs,
            ratings: body.ratings,
            foundedYear: body.foundedYear,
            owner: body.owner,
            licenses: body.licenses,

            // Enhanced SEO & Structure
            customH1: body.customH1,
            lastUpdated: body.lastUpdated,
            comparisonContent: body.comparisonContent,
            internalLinks: body.internalLinks
        };

        const newSite = await BettingSite.create(newSiteData);

        console.log("Site created successfully:", newSite._id);

        return NextResponse.json({ success: true, data: newSite }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating betting site:", error);
        // Return detailed validation error if available
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err: any) => err.message).join(', ');
            return NextResponse.json({ error: messages }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const sites = await BettingSite.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: sites });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

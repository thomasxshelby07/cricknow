import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { BettingSite } from "@/models/BettingSite";

export const dynamic = 'force-dynamic';

// GET Single Site
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const site = await BettingSite.findById(id);

        if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: site });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// UPDATE Site
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const body = await req.json();

        // Validation: If slug is changing, check uniqueness
        if (body.slug) {
            const existing = await BettingSite.findOne({ slug: body.slug, _id: { $ne: id } });
            if (existing) {
                return NextResponse.json({ error: "Slug already taken" }, { status: 400 });
            }
        }

        const updatedSite = await BettingSite.findByIdAndUpdate(
            id,
            {
                $set: {
                    name: body.name,
                    slug: body.slug,
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
                    showOnNewsSidebar: body.showOnNewsSidebar,
                    showOnBlogSidebar: body.showOnBlogSidebar,
                    isFeatured: body.isFeatured,

                    // Content Fields
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

                    // enhance Betting Site Structure fields
                    customH1: body.customH1,
                    lastUpdated: body.lastUpdated,
                    comparisonContent: body.comparisonContent,
                    internalLinks: body.internalLinks
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedSite) return NextResponse.json({ error: "Site not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: updatedSite });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE Site
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const deletedSite = await BettingSite.findByIdAndDelete(id);

        if (!deletedSite) return NextResponse.json({ error: "Site not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Site deleted" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

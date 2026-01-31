import { notFound } from "next/navigation";
import { PageRenderer } from "@/components/PageRenderer";
import connectToDatabase from "@/lib/db";
import { Page } from "@/models/Page";
import { Metadata } from "next";

// Fetch page data
async function getPage(slug: string) {
    await connectToDatabase();
    // Ensure slug starts with /
    const normalizedSlug = slug.startsWith("/") ? slug : "/" + slug;

    // Exact match
    const page = await Page.findOne({
        slug: normalizedSlug,
        status: { $ne: 'archived' }
        // Admin can see drafts? Public usually only published.
        // For now, let's show all if simple, or filter published.
        // 'status': 'published' 
    }).lean();

    return page;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
    const { slug } = await params;
    const slugPath = "/" + slug.join("/");
    const page = await getPage(slugPath);

    if (!page) return {};

    return {
        title: page.seo?.metaTitle || page.title,
        description: page.seo?.metaDescription || "Best Betting Sites",
        robots: {
            index: !page.seo?.noIndex,
            follow: !page.seo?.noFollow,
        }
    };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    const slugPath = "/" + slug.join("/");
    const page = await getPage(slugPath);

    if (!page) notFound();

    return <PageRenderer sections={page.sections || []} />;
}

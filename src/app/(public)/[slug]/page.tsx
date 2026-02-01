import { notFound } from "next/navigation";
import { Metadata } from 'next';
import connectToDatabase from "@/lib/db";
import { BettingSite } from "@/models/BettingSite";
import { Blog } from "@/models/Blog";
import { News } from "@/models/News";
import { Coupon } from "@/models/Coupon";
import { getAdsForPage } from "@/lib/ads";
import { SiteDetailView } from "@/components/views/SiteDetailView";
import { BlogDetailView } from "@/components/views/BlogDetailView";
import { NewsDetailView } from "@/components/views/NewsDetailView";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Helper to find content type
async function getContent(slug: string) {
    await connectToDatabase();

    // 1. Check Betting Sites first (Highest Priority as per requirement "not in between")
    const site = await BettingSite.findOne({ slug, 'visibility.status': 'published' }).lean();
    if (site) return { type: 'site', data: site };

    // 2. Check Blogs
    const blog = await Blog.findOne({ slug, 'visibility.status': 'published' })
        .populate('relatedSites', 'name slug logoUrl rating ctaText joiningBonus affiliateLink')
        .populate('relatedNews', 'title slug coverImageUrl createdAt summary')
        .populate('relatedBlogs', 'title slug coverImageUrl createdAt excerpt')
        .populate('relatedCoupons', 'name slug offer couponCode bonusAmount buttonText redirectLink imageUrl')
        .lean();

    if (blog) return { type: 'blog', data: JSON.parse(JSON.stringify(blog)) };

    // 3. Check News
    const news = await News.findOne({ slug, 'visibility.status': 'published' })
        .populate('relatedSites', 'name slug logoUrl rating ctaText joiningBonus affiliateLink')
        .populate('relatedNews', 'title slug coverImageUrl createdAt summary')
        .populate('relatedBlogs', 'title slug coverImageUrl createdAt excerpt')
        .populate('relatedCoupons', 'name slug offer couponCode bonusAmount buttonText redirectLink imageUrl')
        .lean();

    if (news) return { type: 'news', data: JSON.parse(JSON.stringify(news)) };

    return null;
}

// Helper to get coupons for blog pages
async function getBlogCoupons() {
    await connectToDatabase();
    const coupons = await Coupon.find({
        'visibility.status': 'published',
        showOnBlog: true
    })
        .sort({ 'visibility.displayOrder': 1, createdAt: -1 })
        .limit(2)
        .lean();
    return JSON.parse(JSON.stringify(coupons));
}

// Helper to get coupons for news pages
async function getNewsCoupons() {
    await connectToDatabase();
    const coupons = await Coupon.find({
        'visibility.status': 'published',
        showOnNews: true
    })
        .sort({ 'visibility.displayOrder': 1, createdAt: -1 })
        .limit(2)
        .lean();
    return JSON.parse(JSON.stringify(coupons));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const content = await getContent(slug);

    if (!content) {
        return {
            title: "Content Not Found | CricKnow",
            description: "The page you are looking for does not exist."
        };
    }

    const { type, data } = content;
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/${slug}`;

    if (type === 'site') {
        return {
            title: data.seo?.metaTitle || `${data.name} Review & Bonus`,
            description: data.seo?.metaDescription || `Read our honest review of ${data.name}.`,
            keywords: data.seo?.focusKeywords || [],
            alternates: { canonical: data.seo?.canonicalUrl || url },
            openGraph: {
                title: data.seo?.metaTitle || `${data.name} Review`,
                description: data.seo?.metaDescription || `Read our honest review of ${data.name}.`,
                url: url,
                images: data.coverImageUrl ? [{ url: data.coverImageUrl }] : [],
            }
        };
    } else if (type === 'blog') {
        return {
            title: data.seo?.metaTitle || data.title,
            description: data.seo?.metaDescription || data.excerpt,
            keywords: data.seo?.focusKeywords || [],
            alternates: { canonical: data.seo?.canonicalUrl || url },
            openGraph: {
                title: data.seo?.metaTitle || data.title,
                description: data.seo?.metaDescription || data.excerpt,
                url: url,
                images: data.coverImageUrl ? [{ url: data.coverImageUrl }] : [],
                type: 'article',
                authors: [data.author || 'CricKnow']
            }
        };
    } else if (type === 'news') {
        return {
            title: data.seo?.metaTitle || `${data.title} | CricKnow News`,
            description: data.seo?.metaDescription || data.summary,
            keywords: data.seo?.focusKeywords || [],
            alternates: { canonical: data.seo?.canonicalUrl || url },
            openGraph: {
                title: data.seo?.metaTitle || data.title,
                description: data.seo?.metaDescription || data.summary,
                url: url,
                images: data.coverImageUrl ? [{ url: data.coverImageUrl }] : [],
                type: 'article',
            }
        };
    }

    return {};
}

export default async function UnifiedPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const content = await getContent(slug);

    if (!content) {
        notFound();
    }

    const { type, data } = content;

    if (type === 'site') {
        return <SiteDetailView site={data} />;
    } else if (type === 'blog') {
        const ads = await getAdsForPage('blog', String(data._id));
        const coupons = await getBlogCoupons();
        return <BlogDetailView blog={data} ads={ads} coupons={coupons} />;
    } else if (type === 'news') {
        const ads = await getAdsForPage('news', String(data._id));
        const coupons = await getNewsCoupons();
        return <NewsDetailView news={data} ads={ads} coupons={coupons} />;
    }

    return notFound();
}

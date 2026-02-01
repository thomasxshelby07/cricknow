import { notFound } from "next/navigation";
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, ExternalLink, Star, ChevronRight } from 'lucide-react';
import connectToDatabase from "@/lib/db";
import { Blog } from "@/models/Blog";
import { News } from "@/models/News";
import { Coupon } from "@/models/Coupon";
import { BettingSite } from "@/models/BettingSite";
import { format } from "date-fns";
import { Button } from '@/components/ui/button';
import { getAdsForPage } from "@/lib/ads";
import { SidebarAd } from "@/components/ads/SidebarAd";
import { ContentWithAds } from "@/components/ads/ContentWithAds";
import { BlogDetailView } from "@/components/views/BlogDetailView";

export const dynamic = 'force-dynamic';

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

async function getBlog(slug: string) {
    await connectToDatabase();

    // Ensure models are registered (Critical for populated fields)
    const _ = [BettingSite, News, Coupon];

    return await Blog.findOne({
        slug: slug,
        'visibility.status': 'published'
    })
        .populate('relatedSites', 'name slug logoUrl rating ctaText joiningBonus affiliateLink')
        .populate('relatedBlogs', 'title slug coverImageUrl createdAt excerpt')
        .populate('relatedNews', 'title slug coverImageUrl createdAt summary')
        .populate('relatedCoupons', 'name slug offer couponCode bonusAmount buttonText redirectLink imageUrl')
        .lean();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const blog = await getBlog(slug);

    if (!blog) {
        return {
            title: "Blog Not Found | Cricknow",
            description: "The article you are looking for does not exist."
        };
    }

    return {
        title: blog.seo?.metaTitle || `${blog.title} | Cricknow Blog`,
        description: blog.seo?.metaDescription || blog.excerpt || `Read about ${blog.title}`,
        keywords: blog.seo?.focusKeywords || [],
        openGraph: {
            title: blog.seo?.metaTitle || blog.title,
            description: blog.seo?.metaDescription || blog.excerpt,
            images: blog.coverImageUrl ? [{ url: blog.coverImageUrl }] : [],
        },
        alternates: {
            canonical: blog.seo?.canonicalUrl || `${process.env.NEXT_PUBLIC_APP_URL}/blogs/${blog.slug}`
        },
        robots: {
            index: !blog.seo?.noIndex,
            follow: !blog.seo?.noFollow
        }
    };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const blogRaw = await getBlog(slug);

    if (!blogRaw) {
        notFound();
    }

    const ads = await getAdsForPage('blog', String(blogRaw._id));
    const coupons = await getBlogCoupons();

    // Sanitize blog data for serialization
    const blog = JSON.parse(JSON.stringify(blogRaw));

    return <BlogDetailView blog={blog} ads={ads} coupons={coupons} />;
}

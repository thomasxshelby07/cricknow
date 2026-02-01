import { notFound } from "next/navigation";
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, ExternalLink, Star, ChevronRight } from 'lucide-react';
import connectToDatabase from "@/lib/db";
import { News } from "@/models/News";
import { Blog } from "@/models/Blog";
import { Coupon } from "@/models/Coupon";
import { BettingSite } from "@/models/BettingSite";
import { format } from "date-fns";
import { Button } from '@/components/ui/button';
import { getAdsForPage } from "@/lib/ads";
import { SidebarAd } from "@/components/ads/SidebarAd";
import { ContentWithAds } from "@/components/ads/ContentWithAds";
import { NewsDetailView } from "@/components/views/NewsDetailView";

export const dynamic = 'force-dynamic';

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

async function getNews(slug: string) {
    await connectToDatabase();

    // Ensure models are registered BEFORE query
    const _ = [BettingSite, Blog, Coupon];

    return await News.findOne({
        slug: slug,
        'visibility.status': 'published'
    })
        .populate('relatedSites', 'name slug logoUrl rating ctaText joiningBonus affiliateLink')
        .populate('relatedNews', 'title slug coverImageUrl createdAt summary')
        .populate('relatedBlogs', 'title slug coverImageUrl createdAt excerpt')
        .populate('relatedCoupons', 'name slug offer couponCode bonusAmount buttonText redirectLink imageUrl')
        .lean();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const news = await getNews(slug);

    if (!news) {
        return {
            title: "News Not Found | Cricknow",
            description: "The news article you are looking for does not exist."
        };
    }

    return {
        title: news.seo?.metaTitle || `${news.title} | Cricknow News`,
        description: news.seo?.metaDescription || news.summary || `Read the latest on ${news.title}`,
        keywords: news.seo?.focusKeywords || [],
        openGraph: {
            title: news.seo?.metaTitle || news.title,
            description: news.seo?.metaDescription || news.summary,
            images: news.coverImageUrl ? [{ url: news.coverImageUrl }] : [],
        },
        alternates: {
            canonical: news.seo?.canonicalUrl || `${process.env.NEXT_PUBLIC_APP_URL}/news/${news.slug}`
        },
        robots: {
            index: !news.seo?.noIndex,
            follow: !news.seo?.noFollow
        }
    };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const newsRaw = await getNews(slug);

    if (!newsRaw) {
        notFound();
    }

    const ads = await getAdsForPage('news', String(newsRaw._id));
    const coupons = await getNewsCoupons();

    // Sanitize news data for serialization
    const news = JSON.parse(JSON.stringify(newsRaw));

    return <NewsDetailView news={news} ads={ads} coupons={coupons} />;
}

export interface GameFormData {
    _id?: string;
    title: string;
    slug: string;
    category: string;
    description: string;
    content: string;
    coverImage: string;
    provider?: string;
    rating: number;
    playLink?: string;
    demoLink?: string;
    screenshots?: string[];
    visibility: {
        status: "draft" | "published";
        featured: boolean;
        displayOrder: number;
    };
    seo: {
        // Basic Meta
        metaTitle?: string;
        metaDescription?: string;
        customH1?: string;

        // Keywords
        focusKeywords?: string[];
        keywords?: string[];

        // URLs
        canonicalUrl?: string;

        // Indexing
        noIndex?: boolean;
        noFollow?: boolean;

        // Open Graph
        ogTitle?: string;
        ogDescription?: string;
        ogImage?: string;

        // Twitter Card
        twitterTitle?: string;
        twitterDescription?: string;
        twitterImage?: string;

        // Structured Data
        structuredData?: any;
    };
    // New Fields
    relatedCasinos: string[];
    relatedCoupons: string[];
    relatedNews: string[];
    relatedBlogs: string[];
    faqs: { question: string; answer: string }[];
    pros: string[];
    cons: string[];
}

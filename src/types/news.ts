export interface NewsFormData {
    _id?: string;
    title: string;
    slug: string;
    summary?: string;
    content?: string;
    coverImageUrl?: string;

    // Classification
    category?: 'Cricket Betting' | 'Casino News' | 'Platform Updates' | 'General' | 'Betting News';
    priority?: number;

    // Linking
    relatedSites?: string[]; // IDs
    relatedNews?: string[]; // IDs
    relatedBlogs?: string[]; // IDs of related blogs

    // Smart SEO
    customH1?: string;
    lastUpdated?: string;
    internalLinks?: {
        title: string;
        url: string;
        type: 'blog' | 'news' | 'comparison' | 'other';
    }[];
    faqs?: {
        question: string;
        answer: string;
    }[];

    // Standard SEO & Visibility
    seo: {
        metaTitle: string;
        metaDescription: string;
        focusKeywords: string[];
        canonicalUrl?: string;
        structuredData?: string;
        noIndex: boolean;
        noFollow: boolean;
    };
    visibility: {
        status: 'draft' | 'published' | 'hidden' | 'archived';
        showOnHome: boolean;
        showOnCricket?: boolean; // Optional if you have these categories
    };
    isFeatured: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const initialNewsState: NewsFormData = {
    title: '',
    slug: '',
    summary: '',
    content: '',
    coverImageUrl: '',
    relatedSites: [],
    relatedNews: [],
    relatedBlogs: [],
    customH1: '',
    lastUpdated: '',
    internalLinks: [],
    faqs: [],
    seo: {
        metaTitle: '',
        metaDescription: '',
        focusKeywords: [],
        structuredData: '',
        noIndex: false,
        noFollow: false
    },
    visibility: {
        status: 'draft',
        showOnHome: false
    },
    isFeatured: false
};

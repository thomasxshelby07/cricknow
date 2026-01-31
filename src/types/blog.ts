// Type definitions for Blog
export interface BlogFormData {
    _id?: string;
    title: string;
    slug: string;
    category: string;
    content: string;
    excerpt: string;
    coverImageUrl: string;
    relatedSites?: string[]; // IDs of related sites
    relatedBlogs?: string[]; // IDs of related blogs
    relatedNews?: string[]; // IDs of related news
    seo: {
        metaTitle: string;
        metaDescription: string;
        focusKeywords: string[];
        canonicalUrl: string;
        noIndex: boolean;
        noFollow: boolean;
        structuredData: string;
    };
    // Advanced SEO
    customH1?: string;
    lastUpdated?: string;
    faqs?: { question: string; answer: string }[];

    visibility: {
        status: 'published' | 'draft' | 'archived';
        scheduledPublish: Date | null;
        isFeatured: boolean;
    };
}

export const initialBlogState: BlogFormData = {
    title: "",
    slug: "",
    category: "guides",
    content: "",
    excerpt: "",
    coverImageUrl: "",
    relatedSites: [],
    relatedBlogs: [],
    relatedNews: [],
    customH1: "",
    lastUpdated: "",
    faqs: [],
    seo: {
        metaTitle: "",
        metaDescription: "",
        focusKeywords: [],
        canonicalUrl: "",
        noIndex: false,
        noFollow: false,
        structuredData: ""
    },
    visibility: {
        status: "draft",
        scheduledPublish: null,
        isFeatured: false
    }
};

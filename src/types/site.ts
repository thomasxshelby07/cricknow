export interface BettingSiteFormData {
    name: string;
    slug: string;
    type: 'betting' | 'casino' | 'cricket';
    shortDescription: string;
    fullDescription: string;
    rating: number;
    badges: string[];
    logoUrl: string;
    coverImageUrl: string;
    mainBonusText: string;
    joiningBonus: string;
    redeemBonus: string;
    reDepositBonus: string;
    otherBonus: string;
    affiliateLink: string;
    ctaText: string;
    seo: {
        metaTitle: string;
        metaDescription: string;
        focusKeywords: string[];
        canonicalUrl: string;
        noIndex: boolean;
        noFollow: boolean;
        structuredData: string;
    };
    visibility: {
        status: 'draft' | 'published' | 'archived' | 'hidden';
        showOnHome: boolean;
        showOnMenu: boolean;
        displayOrder: number;
    };
    showOnOffers: boolean;
    showOnCasino: boolean;
    showOnCricket: boolean;
    showOnNewsSidebar: boolean;
    showOnBlogSidebar: boolean;
    isFeatured: boolean;

    // Single Page Content
    reviewTitle?: string;
    reviewContent?: string;
    pros?: string[];
    cons?: string[];
    gallery?: string[];

    userReviews?: {
        user: string;
        rating: number;
        date: string;
        country?: string; // e.g. "India"
        comment: string;
    }[];

    seoSections?: {
        title: string;
        content: string;
        image?: string;
    }[];

    faqs?: {
        question: string;
        answer: string;
    }[];

    // Ratings
    ratings?: {
        overall: number;
        trust: number;
        games: number;
        bonus: number;
        support: number;
    };

    // Meta
    foundedYear?: string;
    owner?: string;
    licenses?: string[];

    // New SEO & Structure Fields
    customH1?: string;
    lastUpdated?: string; // ISO Date string

    // Internal Linking
    internalLinks?: {
        title: string;
        url: string;
        type: 'blog' | 'news' | 'comparison' | 'other';
    }[];

    // Comparison Section
    comparisonContent?: string; // HTML/RichText for "Dafaxbet vs X"
}

export const initialSiteState: BettingSiteFormData = {
    name: '',
    slug: '',
    type: 'betting',
    shortDescription: '',
    fullDescription: '',
    rating: 0,
    badges: [],
    logoUrl: '',
    coverImageUrl: '',
    mainBonusText: '',
    joiningBonus: '',
    redeemBonus: '',
    reDepositBonus: '',
    otherBonus: '',
    affiliateLink: '',
    ctaText: 'Claim Bonus',
    seo: {
        metaTitle: '',
        metaDescription: '',
        focusKeywords: [],
        canonicalUrl: '',
        noIndex: false,
        noFollow: false,
        structuredData: '',
    },
    visibility: {
        status: 'draft',
        showOnHome: false,
        showOnMenu: false,
        displayOrder: 0,
    },
    showOnOffers: false,
    showOnCasino: false,
    showOnCricket: false,
    showOnNewsSidebar: false,
    showOnBlogSidebar: false,
    isFeatured: false,

    reviewTitle: '',
    reviewContent: '',
    pros: [],
    cons: [],
    gallery: [],
    userReviews: [],
    seoSections: [],
    faqs: [],
    ratings: {
        overall: 0,
        trust: 0,
        games: 0,
        bonus: 0,
        support: 0,
    },
    foundedYear: '',
    owner: '',
    licenses: [],
    customH1: '',
    lastUpdated: '',
    internalLinks: [],
    comparisonContent: '',
};

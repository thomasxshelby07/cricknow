export interface PageSection {
    id: string; // UUID
    component: string;
    isVisible: boolean;
    props: Record<string, any>;
}

export interface PageFormData {
    slug: string;
    title: string;
    type: 'system' | 'extra';
    sections: PageSection[];
    seo: {
        metaTitle: string;
        metaDescription: string;
        focusKeywords: string[];
        canonicalUrl: string;
        noIndex: boolean;
        noFollow: boolean;
    };
    status: 'draft' | 'published' | 'archived';
}

export const initialPageState: PageFormData = {
    slug: '',
    title: '',
    type: 'extra',
    sections: [],
    seo: {
        metaTitle: '',
        metaDescription: '',
        focusKeywords: [],
        canonicalUrl: '',
        noIndex: false,
        noFollow: false,
    },
    status: 'draft',
};

export const AVAILABLE_SECTIONS = [
    {
        id: 'Hero',
        label: 'Hero Section',
        defaultProps: { title: 'Welcome', subtitle: 'Best Betting Sites', bgImage: '' }
    },
    {
        id: 'BettingSiteList',
        label: 'Betting Sites List',
        defaultProps: { count: 10, filter: 'all', showFilter: true }
    },
    {
        id: 'PromotionGrid',
        label: 'Promotions Grid',
        defaultProps: { count: 6, filter: 'all' }
    },
    {
        id: 'BlogGrid',
        label: 'Latest Blogs',
        defaultProps: { count: 3, category: 'guides' }
    },
    {
        id: 'NewsGrid',
        label: 'Latest News',
        defaultProps: { count: 4 }
    },
    {
        id: 'ContentBlock',
        label: 'SEO Content Block',
        defaultProps: { content: '<h2>SEO Heading</h2><p>Content goes here...</p>' }
    },
    {
        id: 'FAQ',
        label: 'FAQ Section',
        defaultProps: { items: [{ question: 'Q1?', answer: 'A1' }] }
    }
];

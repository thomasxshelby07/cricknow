import { HeroSection } from "@/components/sections/HeroSection";
import { BettingSiteList } from "@/components/sections/BettingSiteList";
import { ContentBlock } from "@/components/sections/ContentBlock";
import { PromotionGrid } from "@/components/sections/PromotionGrid";
import { BlogGrid } from "@/components/sections/BlogGrid";
import { FAQSection } from "@/components/sections/FAQSection";

interface PageSection {
    id: string;
    component: string;
    props: any;
    isVisible: boolean;
}

export function PageRenderer({ sections }: { sections: PageSection[] }) {
    if (!sections || sections.length === 0) return null;

    return (
        <div className="flex flex-col w-full">
            {sections.map(section => {
                if (!section.isVisible) return null;

                switch (section.component) {
                    case "Hero":
                        return <HeroSection key={section.id} {...section.props} />;

                    case "BettingSiteList":
                        return <BettingSiteList key={section.id} {...section.props} />;

                    case "ContentBlock":
                        return <ContentBlock key={section.id} {...section.props} />;

                    case "PromotionGrid":
                        return <PromotionGrid key={section.id} {...section.props} />;

                    case "BlogGrid":
                        return <BlogGrid key={section.id} {...section.props} />;

                    case "FAQ": // "FAQ" matches id in AVAILABLE_SECTIONS
                        return <FAQSection key={section.id} {...section.props} />;

                    default:
                        // In development, show missing component warning
                        if (process.env.NODE_ENV === 'development') {
                            return <div key={section.id} className="p-4 bg-red-100 text-red-600 border border-red-200 m-4 rounded">Missing Component: {section.component}</div>;
                        }
                        return null;
                }
            })}
        </div>
    );
}

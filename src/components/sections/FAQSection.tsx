import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Script from "next/script";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    items?: FAQItem[]; // Made optional as we provide default content
    title?: string;
    description?: string;
}

const DEFAULT_FAQS = [
    {
        question: "Is online cricket betting legal in India?",
        answer: "There is no federal law in India that explicitly prohibits online betting. However, individual states have their own regulations. States like Telangana, Andhra Pradesh, and Tamil Nadu have banned it. In most other states, it is considered a grey area or legal if the site is based offshore and accepts INR. Always check your local state laws before betting."
    },
    {
        question: "How do I deposit money on betting sites?",
        answer: "Most top-rated betting sites in India now accept convenient local payment methods. You can easily deposit using UPI (Google Pay, PhonePe, Paytm), Netbanking, Indian Debit Cards (Visa/Mastercard), and even cryptocurrencies like Bitcoin and USDT. Deposits are usually instant."
    },
    {
        question: "Can I bet on the IPL?",
        answer: "Absolutely! The Indian Premier League (IPL) is the biggest cricket betting event in the world. All the sites we review offer extensive markets for IPL matches, including match winner, top batsman, total runs, and live in-play betting."
    },
    {
        question: "Are the betting sites listed on Cricknow safe?",
        answer: "Yes. We take safety very seriously. We only list betting sites that are licensed by reputable international authorities (such as the Curacao Gaming Control Board or MGA) and have a proven track record of fair play and timely payouts."
    },
    {
        question: "Do I need to pay tax on my winnings?",
        answer: "Currently, credible offshore betting sites do not deduct tax at source (TDS). However, as per Indian tax laws, you are required to self-declare your income from other sources, including winnings from online games/betting, when filing your ITR. We recommend consulting a CA for specific advice."
    },
    {
        question: "What is a Welcome Bonus?",
        answer: "A Welcome Bonus is a special offer for new players when they sign up and make their first deposit. For example, a '100% Bonus up to ₹10,000' means if you deposit ₹10,000, the site gives you an extra ₹10,000 to bet with. Always check the wagering requirements before claiming."
    }
];

export function FAQSection({ items = DEFAULT_FAQS, title = "Frequently Asked Questions", description = "Everything you need to know about betting in India." }: FAQSectionProps) {
    const faqData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": items.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };

    return (
        <section className="py-20 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-neutral-dark dark:text-white mb-4 text-primary-shadow">{title}</h2>
                    <p className="text-lg text-gray-500 font-medium">{description}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {items.map((item, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 bg-white dark:bg-gray-950 data-[state=open]:border-primary/30 transition-all duration-300">
                                <AccordionTrigger className="text-left font-bold text-lg py-4 hover:no-underline hover:text-primary transition-colors">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed text-base pb-4">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
            {/* JSON-LD for SEO */}
            <Script
                id="faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
            />
        </section>
    );
}


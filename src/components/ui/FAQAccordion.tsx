"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQ {
    question: string;
    answer: string;
}

interface FAQAccordionProps {
    faqs: FAQ[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-3">
            {faqs.map((faq, index) => (
                <div
                    key={index}
                    className={cn(
                        "border border-gray-200 dark:border-neutral-800 rounded-2xl overflow-hidden transition-all duration-300",
                        openIndex === index
                            ? "bg-white dark:bg-neutral-950 border-black dark:border-white shadow-lg"
                            : "bg-gray-50 dark:bg-neutral-900 hover:border-gray-300 dark:hover:border-neutral-700"
                    )}
                >
                    <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full text-left p-5 flex items-center justify-between gap-4 group"
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <div className={cn(
                                "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300",
                                openIndex === index
                                    ? "bg-black dark:bg-white text-white dark:text-black"
                                    : "bg-gray-200 dark:bg-neutral-800 text-gray-600 dark:text-gray-400"
                            )}>
                                {index + 1}
                            </div>
                            <h4 className={cn(
                                "font-bold text-base transition-colors duration-300",
                                openIndex === index
                                    ? "text-black dark:text-white"
                                    : "text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white"
                            )}>
                                {faq.question}
                            </h4>
                        </div>
                        <ChevronDown
                            className={cn(
                                "w-4 h-4 flex-shrink-0 transition-all duration-300",
                                openIndex === index
                                    ? "rotate-180 text-black dark:text-white"
                                    : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                            )}
                        />
                    </button>
                    <div
                        className={cn(
                            "overflow-hidden transition-all duration-300 ease-in-out",
                            openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        )}
                    >
                        <div className="px-5 pb-5 pt-0">
                            <div className="pl-10">
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

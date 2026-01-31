import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface InContentAdProps {
    ad: any;
}

export function InContentAd({ ad }: InContentAdProps) {
    if (!ad || !ad.images?.horizontal) return null;

    return (
        <div className="my-8 bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800">
                <span className="text-[9px] uppercase font-bold text-gray-400">Sponsored</span>
            </div>

            <div className="p-4 flex flex-col md:flex-row items-center gap-4">
                <a
                    href={ad.redirectUrl || "#"}
                    target="_blank"
                    rel="nofollow noreferrer"
                    className="block flex-1 w-full"
                >
                    <div className="relative w-full aspect-[4/1] md:aspect-[5/1] bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                        <img
                            src={ad.images.horizontal}
                            alt={ad.title}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </a>

                <div className="flex-shrink-0 w-full md:w-auto">
                    <a
                        href={ad.redirectUrl || "#"}
                        target="_blank"
                        rel="nofollow noreferrer"
                    >
                        <Button className="w-full md:w-auto font-bold bg-neutral-900 dark:bg-white dark:text-neutral-900 text-white hover:bg-black px-6">
                            {ad.ctaText || "Visit Now"} <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    );
}

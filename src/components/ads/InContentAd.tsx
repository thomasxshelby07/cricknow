import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface InContentAdProps {
    ad: any;
}

export function InContentAd({ ad }: InContentAdProps) {
    if (!ad || !ad.images?.horizontal) return null;

    return (
        <div className="my-8 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-4">
                <a
                    href={ad.redirectUrl || "#"}
                    target="_blank"
                    rel="nofollow noreferrer"
                    className="block flex-1 w-full"
                >
                    <div className="relative w-full aspect-[4/1] md:aspect-[5/1] rounded-lg overflow-hidden">
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

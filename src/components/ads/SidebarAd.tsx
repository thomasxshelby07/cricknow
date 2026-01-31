"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

import { AdRotator } from "./AdRotator";

interface SidebarAdProps {
    ads: any[]; // Changed from single ad to array
}

function SingleSidebarAd({ ad }: { ad: any }) {
    if (!ad || !ad.images?.vertical) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm max-w-[280px] mx-auto">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800">
                <span className="text-[10px] uppercase font-bold text-gray-400">Advertisement</span>
            </div>

            <div className="p-3 space-y-3">
                <a
                    href={ad.redirectUrl || "#"}
                    target="_blank"
                    rel="nofollow noreferrer"
                    className="block relative w-full rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900"
                >
                    <img
                        src={ad.images.vertical}
                        alt={ad.title}
                        className="w-full h-auto max-h-[400px] object-contain mx-auto"
                    />
                </a>

                <a
                    href={ad.redirectUrl || "#"}
                    target="_blank"
                    rel="nofollow noreferrer"
                    className="block"
                >
                    <Button size="sm" className="w-full font-bold bg-primary text-white hover:bg-primary/90 shadow-sm">
                        {ad.ctaText || "Learn More"} <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                </a>
            </div>
        </div>
    );
}

export function SidebarAd({ ads }: SidebarAdProps) {
    if (!ads || ads.length === 0) return null;

    return (
        <AdRotator ads={ads} interval={7000}>
            {(currentAd) => <SingleSidebarAd ad={currentAd} />}
        </AdRotator>
    );
}

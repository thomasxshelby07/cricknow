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
        <div className="max-w-[280px] mx-auto">
            <div className="p-0 space-y-3">
                <a
                    href={ad.redirectUrl || "#"}
                    target="_blank"
                    rel="nofollow noreferrer"
                    className="block relative w-full rounded-lg overflow-hidden"
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

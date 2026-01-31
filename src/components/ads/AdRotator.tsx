"use client";

import { useEffect, useState } from "react";

interface AdRotatorProps {
    ads: any[];
    children: (currentAd: any) => React.ReactNode;
    interval?: number;
}

export function AdRotator({ ads, children, interval = 5000 }: AdRotatorProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!ads || ads.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ads.length);
        }, interval);

        return () => clearInterval(timer);
    }, [ads, interval]);

    if (!ads || ads.length === 0) return null;

    const currentAd = ads[currentIndex];

    // Key change forces re-render/animation if needed
    return (
        <div className="fade-enter-active">
            {children(currentAd)}
        </div>
    );
}

// Add simple CSS animation for fade effect in globals or here via className
// For now, simple switch.

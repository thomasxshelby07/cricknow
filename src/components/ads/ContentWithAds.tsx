"use client";

import React from "react";
import { InContentAd } from "./InContentAd";
import { AdRotator } from "./AdRotator";

interface ContentWithAdsProps {
    content: string;
    ads: any[];
}

export function ContentWithAds({ content, ads }: ContentWithAdsProps) {
    if (!content) return null;

    // Filter for ads that have horizontal images
    const validAds = ads?.filter(a => a.images?.horizontal) || [];

    // If no valid ads, just return content
    if (validAds.length === 0) {
        return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }

    // Split by paragraph closing tag
    const chunks = content.split('</p>');

    // Filter out empty chunks if any
    const validChunks = chunks.filter(c => c.trim().length > 0);
    const total = validChunks.length;

    if (total < 4) {
        return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }

    const pos1 = Math.floor(total / 3);
    const pos2 = Math.floor(2 * total / 3);

    return (
        <>
            {validChunks.map((chunk, i) => {
                // Add the closing tag back
                const html = chunk + '</p>';

                return (
                    <React.Fragment key={i}>
                        <div dangerouslySetInnerHTML={{ __html: html }} className="mb-4 last:mb-0" />
                        {(i === pos1 || i === pos2) && (
                            <div className="my-8 not-prose">
                                <AdRotator ads={validAds} interval={10000}>
                                    {(currentAd) => <InContentAd ad={currentAd} />}
                                </AdRotator>
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </>
    );
}

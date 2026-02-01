import { ExternalLink } from "lucide-react";

interface CouponBannerProps {
    coupon: {
        _id: string;
        title: string;
        description?: string;
        bonusCode?: string;
        bonusAmount?: string;
        ctaText?: string;
        redirectUrl?: string;
        images?: {
            horizontal?: string;
            vertical?: string;
        };
    };
    variant?: "horizontal" | "compact" | "sidebar";
}

export function CouponBanner({ coupon, variant = "horizontal" }: CouponBannerProps) {
    if (variant === "compact") {
        return (
            <div className="bg-gradient-to-r from-black to-neutral-800 dark:from-neutral-900 dark:to-black rounded-xl p-4 border border-gray-800">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Special Offer</p>
                        <h4 className="font-black text-white text-sm mb-1">{coupon.title}</h4>
                        {coupon.bonusCode && (
                            <code className="text-xs bg-white/10 text-white px-2 py-1 rounded font-mono">
                                {coupon.bonusCode}
                            </code>
                        )}
                    </div>
                    {coupon.redirectUrl && (
                        <a
                            href={coupon.redirectUrl}
                            target="_blank"
                            rel="nofollow noreferrer"
                            className="px-4 py-2 bg-white text-black font-bold text-xs uppercase tracking-wide rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                        >
                            {coupon.ctaText || "Claim"}
                        </a>
                    )}
                </div>
            </div>
        );
    }

    if (variant === "sidebar") {
        return (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden hover:border-black dark:hover:border-white transition-all">
                {coupon.images?.horizontal && (
                    <div className="aspect-video bg-gray-100 dark:bg-neutral-800">
                        <img
                            src={coupon.images.horizontal}
                            alt={coupon.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                <div className="p-4">
                    <h4 className="font-black text-base text-black dark:text-white mb-2">{coupon.title}</h4>
                    {coupon.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {coupon.description}
                        </p>
                    )}
                    {coupon.bonusCode && (
                        <div className="mb-3 p-2 bg-gray-50 dark:bg-neutral-800 rounded border border-gray-200 dark:border-neutral-700">
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Code</p>
                            <p className="text-sm font-black text-black dark:text-white tracking-wider">
                                {coupon.bonusCode}
                            </p>
                        </div>
                    )}
                    {coupon.redirectUrl && (
                        <a
                            href={coupon.redirectUrl}
                            target="_blank"
                            rel="nofollow noreferrer"
                            className="block w-full text-center py-2 bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wide rounded-lg hover:bg-neutral-800 dark:hover:bg-gray-200 transition-colors"
                        >
                            {coupon.ctaText || "Claim Now"}
                        </a>
                    )}
                </div>
            </div>
        );
    }

    // Default: horizontal variant
    return (
        <div className="bg-gradient-to-r from-black via-neutral-900 to-black dark:from-neutral-900 dark:via-black dark:to-neutral-900 rounded-2xl p-6 border border-gray-800 relative overflow-hidden group">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)' }}></div>
            </div>

            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                {/* Left: Image (if available) */}
                {coupon.images?.horizontal && (
                    <div className="hidden md:block w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-lg border border-white/10">
                        <img
                            src={coupon.images.horizontal}
                            alt={coupon.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Center: Content */}
                <div className="flex-1 w-full text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-white/10 text-white text-[10px] font-bold rounded uppercase tracking-widest border border-white/5">
                            Exclusive Offer
                        </span>
                    </div>
                    <h3 className="font-black text-white text-lg sm:text-xl mb-1 sm:mb-2 leading-tight">{coupon.title}</h3>
                    {coupon.description && (
                        <p className="text-sm text-gray-400 mb-3 line-clamp-1">{coupon.description}</p>
                    )}
                    {coupon.bonusCode && (
                        <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">
                            <span className="text-xs text-gray-400 font-medium">Code:</span>
                            <code className="text-sm font-black text-white tracking-wider">{coupon.bonusCode}</code>
                        </div>
                    )}
                </div>

                {/* Right: CTA */}
                {coupon.redirectUrl && (
                    <a
                        href={coupon.redirectUrl}
                        target="_blank"
                        rel="nofollow noreferrer"
                        className="w-full sm:w-auto flex-shrink-0 px-6 py-3 bg-white text-black font-bold text-sm uppercase tracking-wide rounded-xl hover:bg-gray-100 transition-all hover:scale-105 flex items-center justify-center gap-2 group shadow-xl"
                    >
                        {coupon.ctaText || "Claim Now"}
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                )}
            </div>
        </div>
    );
}

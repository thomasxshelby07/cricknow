"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const BETTING_SITES_MENU = [
    { label: "Betting Sites in India", href: "/betting-sites" },
    { label: "Top Betting Sites", href: "/betting-sites" },
    { label: "Casino Sites", href: "/online-casino" },
    { label: "IPL Betting Sites", href: "/betting-sites" },
    { label: "New Betting Sites", href: "/betting-sites" },
];

const NEWS_MENU = [
    { label: "Latest News", href: "/news" },
    { label: "Cricket Betting News", href: "/news?category=Cricket News" },
    { label: "Casino News", href: "/news?category=Casino News" },
    { label: "Platform Updates", href: "/news?category=Platform Updates" },
];

const BLOGS_MENU = [
    { label: "All Blogs", href: "/blogs" },
    { label: "Betting Guides", href: "/blogs?category=guides" },
    { label: "Cricket Tips", href: "/blogs?category=cricket" },
    { label: "Casino Strategies", href: "/blogs?category=casino" },
];

const SIMPLE_NAV_LINKS = [
    { label: "Contact Us", href: "/contact" },
    { label: "Apps", href: "/cricket-apps" },
];

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Mobile Dropdown States
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-sm transition-all duration-300">
            <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-6">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-2xl md:text-3xl font-black tracking-tighter text-black dark:text-white transition-opacity">
                        CRICK<span className="text-gray-400">NOW</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-6 xl:gap-8">

                    {/* Betting Sites Dropdown */}
                    <div className="relative group">
                        <Link
                            href="/betting-sites"
                            className="flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors py-4"
                        >
                            Betting Sites <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                        </Link>
                        <div className="absolute top-full left-0 w-60 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                            <div className="py-2">
                                {BETTING_SITES_MENU.map((item, index) => (
                                    <Link key={index} href={item.href} className="block px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0">
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* News Dropdown */}
                    <div className="relative group">
                        <Link
                            href="/news"
                            className="flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors py-4"
                        >
                            News <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                        </Link>
                        <div className="absolute top-full left-0 w-60 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                            <div className="py-2">
                                {NEWS_MENU.map((item, index) => (
                                    <Link key={index} href={item.href} className="block px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0">
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Blogs Dropdown */}
                    <div className="relative group">
                        <Link
                            href="/blogs"
                            className="flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors py-4"
                        >
                            Blogs <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                        </Link>
                        <div className="absolute top-full left-0 w-60 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                            <div className="py-2">
                                {BLOGS_MENU.map((item, index) => (
                                    <Link key={index} href={item.href} className="block px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0">
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Simple Links */}
                    {SIMPLE_NAV_LINKS.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-bold uppercase tracking-wide text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors hover:scale-105 transform"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="hidden lg:flex items-center gap-3">
                    <div className="relative group">
                        <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full w-10 h-10">
                            <Search className="h-5 w-5" />
                        </Button>
                    </div>
                    <Link href="/betting-sites">
                        <Button className="bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black rounded-full px-6 py-5 font-bold shadow-lg shadow-black/20 hover:shadow-xl transition-all hover:scale-105 text-sm uppercase tracking-wide">
                            Top Bookies
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="lg:hidden p-2 text-black dark:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-16 bg-white dark:bg-black z-40 flex flex-col pt-4 overflow-y-auto w-full h-[calc(100vh-4rem)]">
                    <div className="flex flex-col px-4 space-y-2">

                        {/* Mobile: Betting Sites */}
                        <div className="border-b border-gray-100 dark:border-gray-900 pb-2">
                            <button
                                onClick={() => toggleDropdown('betting')}
                                className="flex w-full items-center justify-between text-lg font-bold text-gray-600 dark:text-gray-400 py-3 hover:text-black dark:hover:text-white"
                            >
                                Betting Sites <ChevronDown className={cn("w-5 h-5 transition-transform", openDropdown === 'betting' && "rotate-180")} />
                            </button>
                            {openDropdown === 'betting' && (
                                <div className="pl-4 space-y-2 pb-2 bg-gray-50 dark:bg-neutral-900/50 rounded-xl mb-2">
                                    {BETTING_SITES_MENU.map((item, index) => (
                                        <Link key={index} href={item.href} onClick={() => setIsMenuOpen(false)} className="block py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white border-b border-gray-100 dark:border-gray-800/50 last:border-0">
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile: News */}
                        <div className="border-b border-gray-100 dark:border-gray-900 pb-2">
                            <button
                                onClick={() => toggleDropdown('news')}
                                className="flex w-full items-center justify-between text-lg font-bold text-gray-600 dark:text-gray-400 py-3 hover:text-black dark:hover:text-white"
                            >
                                News <ChevronDown className={cn("w-5 h-5 transition-transform", openDropdown === 'news' && "rotate-180")} />
                            </button>
                            {openDropdown === 'news' && (
                                <div className="pl-4 space-y-2 pb-2 bg-gray-50 dark:bg-neutral-900/50 rounded-xl mb-2">
                                    {NEWS_MENU.map((item, index) => (
                                        <Link key={index} href={item.href} onClick={() => setIsMenuOpen(false)} className="block py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white border-b border-gray-100 dark:border-gray-800/50 last:border-0">
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile: Blogs */}
                        <div className="border-b border-gray-100 dark:border-gray-900 pb-2">
                            <button
                                onClick={() => toggleDropdown('blogs')}
                                className="flex w-full items-center justify-between text-lg font-bold text-gray-600 dark:text-gray-400 py-3 hover:text-black dark:hover:text-white"
                            >
                                Blogs <ChevronDown className={cn("w-5 h-5 transition-transform", openDropdown === 'blogs' && "rotate-180")} />
                            </button>
                            {openDropdown === 'blogs' && (
                                <div className="pl-4 space-y-2 pb-2 bg-gray-50 dark:bg-neutral-900/50 rounded-xl mb-2">
                                    {BLOGS_MENU.map((item, index) => (
                                        <Link key={index} href={item.href} onClick={() => setIsMenuOpen(false)} className="block py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white border-b border-gray-100 dark:border-gray-800/50 last:border-0">
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {SIMPLE_NAV_LINKS.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="block text-lg font-bold text-gray-600 dark:text-gray-400 py-3 border-b border-gray-100 dark:border-gray-900 hover:text-black dark:hover:text-white transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <div className="p-4 mt-auto mb-8 space-y-4">
                        <Button variant="outline" className="w-full text-lg h-12 rounded-xl border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900" onClick={() => setIsMenuOpen(false)}>
                            <Search className="mr-2 h-5 w-5" /> Search
                        </Button>
                        <Button className="w-full bg-black text-white dark:bg-white dark:text-black text-lg h-12 rounded-xl font-bold hover:opacity-90 shadow-lg" onClick={() => setIsMenuOpen(false)}>View Top Bookies</Button>
                    </div>
                </div>
            )}
        </header>
    );
}

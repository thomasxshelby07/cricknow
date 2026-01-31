import Link from "next/link";
import { Facebook, Twitter, Instagram, ArrowRight, Shield } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-black text-white pt-20 pb-10 border-t border-neutral-900">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="block">
                            <h3 className="text-2xl font-black tracking-tighter text-white">
                                CRICK<span className="text-gray-500">NOW</span>
                            </h3>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed font-medium">
                            Your ultimate guide to online cricket betting, casino strategies, and exclusive bonuses. We provide honest reviews and latest news for the modern bettor.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-900 text-gray-400 hover:bg-white hover:text-black transition-all">
                                <Twitter className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-900 text-gray-400 hover:bg-white hover:text-black transition-all">
                                <Facebook className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-900 text-gray-400 hover:bg-white hover:text-black transition-all">
                                <Instagram className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Explore */}
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-gray-300">Explore</h4>
                        <ul className="space-y-3 text-sm text-gray-400 font-medium">
                            <li><Link href="/betting-sites" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2">All Betting Sites <ArrowRight className="w-3 h-3 opacity-0 hover:opacity-100 transition-opacity" /></Link></li>
                            <li><Link href="/cricket-apps" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2">Cricket Betting Apps</Link></li>
                            <li><Link href="/online-casino" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2">Live Casino Reivews</Link></li>
                            <li><Link href="/news" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2">Latest News & Tips</Link></li>
                        </ul>
                    </div>

                    {/* Support & Legal */}
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-gray-300">Legal</h4>
                        <ul className="space-y-3 text-sm text-gray-400 font-medium">
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="/responsible-gambling" className="hover:text-white transition-colors">Responsible Gambling</Link></li>
                        </ul>
                    </div>

                    {/* Disclaimer */}
                    <div>
                        <div className="bg-neutral-900/50 p-6 rounded-lg border border-neutral-800">
                            <div className="flex items-center gap-2 mb-3 text-white">
                                <Shield className="w-4 h-4" />
                                <span className="font-bold text-xs uppercase tracking-wider">18+ Only</span>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed font-normal">
                                Gambling involves risk. Please gamble responsibly. Do not bet with money you cannot afford to lose. This site is for informational purposes only.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500 font-medium">
                        &copy; {new Date().getFullYear()} Cricknow. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-[10px] font-bold text-gray-600 tracking-widest uppercase">
                        <span>Secure</span>
                        <span>Reliable</span>
                        <span>Verified</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

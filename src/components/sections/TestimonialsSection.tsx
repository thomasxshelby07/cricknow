import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
    {
        name: "Rahul Sharma",
        role: "Pro Punter",
        rating: 5,
        text: "Cricknow helped me find the best betting sites for IPL. The withdrawal speed ratings are super accurate. I got my winnings in 15 mins via UPI!",
        avatar: "R"
    },
    {
        name: "Amit Patel",
        role: "Cricket Fan",
        rating: 5,
        text: "I was confused about which site is legal. Thanks to Cricknow's detailed guides, I found a safe platform. The detailed reviews are a game changer.",
        avatar: "A"
    },
    {
        name: "Vikram Singh",
        role: "Casual Better",
        rating: 4,
        text: "Great layout and honest comparisons. I love the exclusive bonus codes. Managed to get a 150% deposit bonus using their link.",
        avatar: "V"
    }
];

export function TestimonialsSection() {
    return (
        <section className="py-20 bg-white dark:bg-black border-y border-gray-100 dark:border-neutral-900 relative overflow-hidden">
            <div className="container mx-auto px-4 relative">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 border border-gray-200 dark:border-neutral-800 px-3 py-1 rounded-full mb-6">
                        <div className="flex text-black dark:text-white">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">Trusted by Experts</span>
                    </div>
                    <h2 className="text-3xl font-bold text-neutral-dark dark:text-white mb-4 tracking-tight">What Our Users Say</h2>
                    <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto font-medium">
                        Join thousands of satisfied users who have found their perfect betting partner through Cricknow.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 dark:bg-neutral-900/50 p-6 rounded-lg border border-gray-100 dark:border-neutral-800 relative hover:border-gray-300 dark:hover:border-neutral-700 transition-colors duration-300">
                            <Quote className="absolute top-6 right-6 w-6 h-6 text-gray-200 dark:text-neutral-800" />

                            <div className="flex gap-0.5 text-black dark:text-white mb-4">
                                {[...Array(item.rating)].map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                                ))}
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 font-normal text-sm sm:text-base">
                                "{item.text}"
                            </p>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xs">
                                    {item.avatar}
                                </div>
                                <div>
                                    <h4 className="font-bold text-neutral-dark dark:text-white text-xs sm:text-sm uppercase tracking-wide">{item.name}</h4>
                                    <span className="text-[10px] sm:text-xs text-gray-400 font-medium">{item.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

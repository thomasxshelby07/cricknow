import { Shield, CreditCard, Zap, TrendingUp, CheckCircle2, Lock } from "lucide-react";

export function BettingSitesInfoSection() {
    const features = [
        {
            icon: Shield,
            title: "Safety & Security",
            description: "Licensed operators with SSL encryption and secure payment gateways to protect your data and funds."
        },
        {
            icon: CreditCard,
            title: "Payment Methods",
            description: "Multiple deposit and withdrawal options including UPI, Paytm, PhonePe, NetBanking, and cryptocurrencies."
        },
        {
            icon: Zap,
            title: "Fast Withdrawals",
            description: "Quick processing times with most platforms offering instant to 24-hour withdrawal processing."
        },
        {
            icon: TrendingUp,
            title: "Competitive Odds",
            description: "Best market odds across cricket, football, tennis, and other popular sports for maximum returns."
        },
        {
            icon: CheckCircle2,
            title: "Welcome Bonuses",
            description: "Generous sign-up offers, free bets, and ongoing promotions to boost your betting bankroll."
        },
        {
            icon: Lock,
            title: "Responsible Gaming",
            description: "Tools and features to help you bet responsibly including deposit limits and self-exclusion options."
        }
    ];

    return (
        <section className="py-16 bg-gray-50 dark:bg-neutral-950 border-y border-gray-200 dark:border-neutral-900">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-4 tracking-tight">
                        Betting Sites in India
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        India's online betting landscape has evolved significantly, offering players access to world-class platforms
                        with competitive odds, secure transactions, and exciting bonuses. Here's what makes a great betting site.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 rounded-xl p-6 hover:border-black dark:hover:border-white transition-all duration-300 group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-black dark:bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-6 h-6 text-white dark:text-black" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-black text-black dark:text-white mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Info */}
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 rounded-xl p-8">
                    <h3 className="text-2xl font-black text-black dark:text-white mb-4">
                        What to Look for in a Betting Platform
                    </h3>
                    <div className="space-y-4 text-gray-600 dark:text-gray-400">
                        <p className="leading-relaxed">
                            When choosing an online betting platform, it's essential to consider several key factors.
                            <strong className="text-black dark:text-white"> Licensing and regulation</strong> ensure the platform operates legally and maintains fair practices.
                            Look for sites with <strong className="text-black dark:text-white">valid gaming licenses</strong> from reputable jurisdictions.
                        </p>
                        <p className="leading-relaxed">
                            <strong className="text-black dark:text-white">Payment flexibility</strong> is crucial for Indian players.
                            The best platforms support popular local payment methods like UPI, Paytm, and NetBanking, alongside international options.
                            Fast withdrawal processing and minimal fees are equally important.
                        </p>
                        <p className="leading-relaxed">
                            <strong className="text-black dark:text-white">User experience</strong> matters significantly.
                            A well-designed mobile app or responsive website, live betting features, comprehensive sports coverage,
                            and 24/7 customer support in multiple languages enhance your overall betting experience.
                        </p>
                        <p className="leading-relaxed">
                            Finally, <strong className="text-black dark:text-white">responsible gaming tools</strong> demonstrate a platform's commitment to player welfare.
                            Features like deposit limits, reality checks, and self-exclusion options help maintain a healthy betting environment.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

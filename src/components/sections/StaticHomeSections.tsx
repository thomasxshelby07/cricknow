import Link from "next/link";
import { CheckCircle, Shield, Award, Users, Zap, Headphones, IndianRupee } from "lucide-react";

export function AboutPlatform() {
    return (
        <section className="py-20 bg-black text-white relative overflow-hidden">
            <div className="container mx-auto px-4 relative max-w-4xl text-center">
                <div className="inline-block px-3 py-1 border border-white/20 rounded-full bg-white/5 text-gray-200 text-xs font-medium uppercase tracking-widest mb-6">
                    Trusted by 100,000+ Players
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
                    About Cricknow
                </h2>

                <div className="space-y-4 text-base md:text-lg text-gray-300 leading-relaxed">
                    <p className="mx-auto">
                        Cricknow is India's premier destination for safe, legal, and reliable online cricket betting and casino reviews. Founded by a team of betting experts and cricket fanatics, our mission is to bring transparency to the online gambling industry.
                    </p>
                    <p className="mx-auto">
                        We don't just list sites; we test them. From verifying fast UPI withdrawals to checking the fairness of welcome bonuses, we do the heavy lifting so you can play with confidence. Whether you're looking for the best IPL betting odds or the top trusted casinos, Cricknow is your ultimate guide.
                    </p>
                </div>
            </div>
        </section>
    );
}

export function WhyChooseUs() {
    const reasons = [
        {
            icon: Shield,
            title: "100% Licensed & Verified",
            desc: "Safety first. We strictly only list betting sites that hold valid international licenses (Curacao, MGA, UKGC) and accept Indian players legally."
        },
        {
            icon: IndianRupee,
            title: "Indian Payment Methods",
            desc: "Zero hassle deposits. We prioritize sites supporting UPI, Paytm, PhonePe, GPay, and Indian Netbanking for seamless transactions."
        },
        {
            icon: Zap,
            title: "Instant Withdrawals",
            desc: "Why wait for your winnings? Our recommended sites are tested for payout speed, ensuring you get your money in minutes, not days."
        },
        {
            icon: Award,
            title: "Unbiased Expert Reviews",
            desc: "Real tests, real money. Our experts register, deposit, and play to give you honest, unfiltered reviews of every platform."
        },
        {
            icon: CheckCircle,
            title: "Exclusive Bonus Offers",
            desc: "Get more bang for your buck. Claim verified exclusive welcome bonuses, free bets, and cashback offers available only through Cricknow."
        },
        {
            icon: Headphones,
            title: "24/7 Support Assistance",
            desc: "Detailed guides and help. We test customer support responsiveness so you're never left in the dark when you need help."
        }
    ];

    return (
        <section className="py-20 bg-neutral-950 text-white border-y border-white/5">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold mb-4 tracking-tight">Why Choose Cricknow?</h2>
                    <p className="text-gray-400 font-medium">
                        Transparency, expertise, and trust in online betting.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reasons.map((item, idx) => (
                        <div key={idx} className="bg-neutral-900/50 p-6 rounded-lg border border-white/5 hover:border-white/20 transition-colors duration-300 group">
                            <div className="w-10 h-10 bg-white/5 text-white rounded-lg flex items-center justify-center mb-4 group-hover:bg-white group-hover:text-black transition-all duration-300">
                                <item.icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-white">{item.title}</h3>
                            <p className="text-sm text-gray-300 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function ResponsibleGaming() {
    return (
        <section className="py-16 bg-black text-white text-sm border-t border-white/10">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
                    <div className="flex items-center gap-3 mb-4 text-gray-200">
                        <Shield className="w-6 h-6" />
                        <span className="font-bold tracking-widest uppercase text-xs">Play Responsibly</span>
                    </div>

                    <div className="space-y-3 text-gray-300 text-xs leading-relaxed">
                        <p>
                            Gambling involves risk. Please play responsibly and only bet with money you can afford to lose.
                            Cricknow is dedicated to promoting responsible gaming. You must be 18 years or older to use any of the betting sites listed.
                        </p>
                        <p className="opacity-80">
                            The information provided on this site is for entertainment and informational purposes only.
                            We do not own or operate any online gambling services. Please check your local laws and regulations
                            before participating in online betting.
                        </p>
                    </div>

                    <div className="mt-6 flex flex-wrap justify-center gap-6 opacity-60 text-[10px] font-bold tracking-widest text-gray-400">
                        <div>GAMCARE</div>
                        <div>BEGAMBLEAWARE</div>
                        <div>18+ ONLY</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

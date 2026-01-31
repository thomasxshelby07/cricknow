import React from "react";

export function SEOContent() {
    return (
        <section className="w-full py-16 bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-4 md:px-6 max-w-5xl">
                <article className="prose prose-lg dark:prose-invert max-w-none mx-auto">

                    {/* Main Heading */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-white mb-4">
                            Find Safe and Legit Betting Sites for Indians
                        </h2>
                        <div className="w-20 h-1.5 bg-neutral-900 dark:bg-white mx-auto rounded-full"></div>
                    </div>

                    {/* Intro Text */}
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-10 text-center max-w-3xl mx-auto">
                        At <span className="font-bold text-neutral-900 dark:text-white">Cricknow</span>, we’ve made it our job to give Indian players the best advice and
                        exclusive bonus offers for <span className="font-semibold text-primary">online sports betting</span>.
                        We help you navigate the crowded market to find the <span className="font-semibold text-primary">best online betting sites</span> tailored for your needs.
                    </p>



                    {/* SEO Rich Content Blocks */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
                                Why Choose Our Recommended Betting Sites?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                We rigorously test every platform to ensure they offer <strong className="text-neutral-800 dark:text-gray-200">fast withdrawals</strong>,
                                <strong className="text-neutral-800 dark:text-gray-200">competitive odds</strong>, and accept <strong className="text-neutral-800 dark:text-gray-200">Indian Rupees (INR)</strong>.
                                Whether you are betting on the IPL, World Cup, or local leagues, safety is our top priority.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
                                Understanding Online Betting Laws in India
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Navigating technicalities can be tough. We simplify the legal landscape for you, clarifying how offshore betting sites operate and how you can place bets legally and safely from India.
                            </p>
                        </div>
                    </div>

                </article>
            </div>
        </section>
    );
}

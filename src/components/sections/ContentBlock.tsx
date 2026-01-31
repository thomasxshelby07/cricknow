interface ContentBlockProps {
    content: string;
}

export function ContentBlock({ content }: ContentBlockProps) {
    return (
        <section className="py-12 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4 max-w-4xl">
                <div
                    className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-neutral-dark prose-a:text-primary"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </section>
    );
}

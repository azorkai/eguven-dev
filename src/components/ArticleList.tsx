import ArticleCard from './ArticleCard';

const ArticleList: React.FC = () => {
    const articles: any[] = [];

    return (
        <section className="lg:w-3/4 flex flex-col">
            {articles.length > 0 ? (
                <>
                    {articles.map((article, index) => (
                        <ArticleCard key={index} {...article} />
                    ))}
                    <div className="border-t border-gray-300 dark:border-gray-800 pt-12 flex justify-center">
                        <button className="border border-gray-300 dark:border-gray-700 px-8 py-4 text-xs tracking-[0.2em] uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300">
                            Load Older Posts
                        </button>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 border border-dashed border-gray-300 dark:border-gray-800 rounded-lg opacity-50">
                    <span className="text-[10px] tracking-[0.3em] uppercase mb-4">Registry Empty</span>
                    <p className="text-sm font-light text-text-muted">No technical articles have been indexed yet.</p>
                </div>
            )}
        </section>
    );
};

export default ArticleList;

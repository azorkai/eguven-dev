import ArticleCard from './ArticleCard';
import { useLanguage } from '../i18n/useLanguage';

const ArticleList: React.FC = () => {
    const { t } = useLanguage();
    const articles: any[] = [];

    return (
        <section className="lg:w-3/4 flex flex-col">
            {articles.length > 0 ? (
                <>
                    {articles.map((article, index) => (
                        <ArticleCard key={index} {...article} />
                    ))}
                    <div className="border-t border-rule pt-12 flex justify-center">
                        <button className="border border-ink px-10 py-4 text-[11px] font-bold tracking-[0.2em] uppercase text-ink hover:bg-ink hover:text-paper-raised transition-colors duration-300">
                            {t.articles.loadOlder}
                        </button>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 border border-rule bg-paper-raised/50">
                    <span className="label text-ink-muted mb-4">{t.articles.empty}</span>
                    <p className="px-6 text-center text-sm font-light text-ink-muted">{t.articles.emptyCopy}</p>
                </div>
            )}
        </section>
    );
};

export default ArticleList;

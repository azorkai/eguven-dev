import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';

interface ArticleCardProps {
    date: string;
    category: string;
    title: string;
    description: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ date, category, title, description }) => {
    const { t } = useLanguage();

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group border-t border-rule py-12 flex flex-col md:flex-row gap-6 md:gap-12 hover:bg-paper-sunk/60 transition-colors duration-300 px-4 -mx-4 cursor-pointer"
        >
            <div className="md:w-1/4 flex flex-col justify-between md:border-r md:border-rule md:pr-6">
                <span className="text-xs tracking-[0.08em] uppercase text-ink-muted">{date}</span>
                <span className="hidden md:inline-block ink-block rounded-sm text-[11px] font-bold uppercase tracking-[0.18em] px-2 py-1 w-fit mt-3">
                    {category}
                </span>
            </div>
            <div className="md:w-3/4">
                <h2 className="font-headline text-3xl md:text-4xl font-extrabold leading-[1.05] tracking-[-0.015em] mb-4 text-ink group-hover:text-accent transition-colors duration-300">
                    {title}
                </h2>
                <p className="text-ink-body leading-relaxed mb-6 measure">
                    {description}
                </p>
                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink border-b border-transparent group-hover:border-ink transition-all pb-1">
                        {t.articles.readArticle}
                    </span>
                    <ArrowRight className="w-4 h-4 text-ink opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0 duration-300" />
                </div>
            </div>
        </motion.article>
    );
};

export default ArticleCard;

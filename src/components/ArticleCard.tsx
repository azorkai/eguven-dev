import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ArticleCardProps {
    date: string;
    category: string;
    title: string;
    description: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ date, category, title, description }) => {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group border-t border-gray-300 dark:border-gray-800 py-12 flex flex-col md:flex-row gap-6 md:gap-12 hover:bg-gray-100 dark:hover:bg-[#111] transition-colors duration-500 px-4 -mx-4 cursor-pointer"
        >
            <div className="md:w-1/4 flex flex-col justify-between">
                <span className="text-xs font-mono text-gray-500 dark:text-gray-500">{date}</span>
                <span className="hidden md:block text-[10px] uppercase tracking-widest text-black dark:text-white bg-gray-200 dark:bg-gray-800 w-fit px-2 py-1 mt-2">
                    {category}
                </span>
            </div>
            <div className="md:w-3/4">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:translate-x-2 transition-transform duration-300">
                    {title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-6 max-w-2xl">
                    {description}
                </p>
                <div className="flex items-center gap-4">
                    <span className="text-xs uppercase tracking-widest border-b border-transparent group-hover:border-black dark:group-hover:border-white transition-all pb-1">
                        Read Article
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0 duration-300" />
                </div>
            </div>
        </motion.article>
    );
};

export default ArticleCard;

const Sidebar: React.FC = () => {
    const topics = [
        { name: 'All Posts', count: 12, active: true },
        { name: 'Backend Engineering', count: 5 },
        { name: 'Frontend Performance', count: 3 },
        { name: 'Artificial Intelligence', count: 2 },
        { name: 'DevOps', count: 2 },
    ];

    return (
        <aside className="lg:w-1/4 flex flex-col gap-8 lg:sticky lg:top-12 h-fit">
            <div className="border-t border-gray-300 dark:border-gray-800 pt-6">
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-6 text-black dark:text-white">Topics</h3>
                <ul className="space-y-4 text-sm font-light">
                    {topics.map((topic) => (
                        <li key={topic.name}>
                            <button className={`group flex items-center justify-between w-full text-left transition-colors ${topic.active ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}>
                                <span className={`${topic.active ? 'border-b border-black dark:border-white pb-0.5' : 'group-hover:translate-x-1 transition-transform duration-300'}`}>
                                    {topic.name}
                                </span>
                                <span className={`text-[10px] ${topic.active ? 'text-gray-400' : 'text-gray-600 dark:text-gray-600'} group-hover:text-black dark:group-hover:text-white transition-colors`}>
                                    {topic.count.toString().padStart(2, '0')}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="border-t border-gray-300 dark:border-gray-800 pt-6 mt-4">
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-6 text-black dark:text-white">Subscribe</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                    Get the latest articles delivered directly to your inbox once a month.
                </p>
                <form className="flex flex-col gap-3">
                    <input
                        className="bg-transparent border-b border-gray-400 dark:border-gray-700 text-sm py-2 placeholder-gray-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors text-black dark:text-white w-full"
                        placeholder="Email Address"
                        type="email"
                    />
                    <button className="text-xs tracking-widest uppercase text-left mt-2 hover:text-black dark:hover:text-white hover:underline text-gray-500 dark:text-gray-400 transition-colors">
                        Subscribe →
                    </button>
                </form>
            </div>
        </aside>
    );
};

export default Sidebar;

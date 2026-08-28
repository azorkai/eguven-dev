import { useLanguage } from '../i18n/useLanguage';

const Sidebar: React.FC = () => {
    const { t } = useLanguage();

    const topics = [
        { key: 'all', name: t.sidebar.topicAll, count: 12, active: true },
        { key: 'backend', name: t.sidebar.topicBackend, count: 5 },
        { key: 'frontend', name: t.sidebar.topicFrontend, count: 3 },
        { key: 'ai', name: t.sidebar.topicAi, count: 2 },
        { key: 'devops', name: t.sidebar.topicDevops, count: 2 },
    ];

    return (
        <aside className="lg:w-1/4 flex flex-col gap-10 lg:sticky lg:top-28 h-fit">
            <div className="border-t-2 border-ink pt-5">
                <h3 className="label mb-5">{t.sidebar.topics}</h3>
                <ul className="divide-y divide-rule text-[15px]">
                    {topics.map((topic) => (
                        <li key={topic.key}>
                            <button className={`group flex min-h-11 w-full items-center justify-between gap-3 py-2.5 text-left transition-colors ${topic.active ? 'text-ink font-semibold' : 'text-ink-muted hover:text-ink'}`}>
                                <span className={`${topic.active ? 'marker text-ink' : 'group-hover:translate-x-1 transition-transform duration-300'}`}>
                                    {topic.name}
                                </span>
                                <span className="shrink-0 text-xs tabular-nums text-ink-faint group-hover:text-ink transition-colors">
                                    {topic.count.toString().padStart(2, '0')}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="border-t-2 border-ink pt-5 mt-6">
                <h3 className="label mb-4">{t.sidebar.subscribe}</h3>
                <p className="mb-4 text-[15px] leading-relaxed text-ink-muted">
                    {t.sidebar.subscribeCopy}
                </p>
                <form className="flex flex-col gap-3">
                    <input
                        className="w-full min-h-11 border-b border-rule-strong bg-transparent text-base py-2 text-ink transition-colors focus:border-ink focus:outline-none md:text-sm"
                        placeholder={t.sidebar.emailPlaceholder}
                        aria-label={t.sidebar.emailLabel}
                        type="email"
                    />
                    <button className="mt-1 inline-flex min-h-11 items-center text-left text-[11px] font-bold tracking-[0.16em] text-ink-muted uppercase underline-offset-4 transition-colors hover:text-ink hover:underline">
                        {t.sidebar.subscribeCta} →
                    </button>
                </form>
            </div>
        </aside>
    );
};

export default Sidebar;

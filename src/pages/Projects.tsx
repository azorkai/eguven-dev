import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/useLanguage';
import { rich } from '../i18n/rich';
import { PROJECTS, PROJECT_FILTERS, type ProjectFilter } from '../content/projects';
import { projectsEn } from '../content/projects.en';
import { projectsTr } from '../content/projects.tr';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.8
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
} as const;

const Projects: React.FC = () => {
    const { lang, t } = useLanguage();
    const [filter, setFilter] = useState<ProjectFilter>('ALL');
    const [worksClickCount, setWorksClickCount] = useState(0);

    const copy = lang === 'tr' ? projectsTr : projectsEn;

    const filterLabels: Record<ProjectFilter, string> = {
        ALL: t.projects.filterAll,
        INFRASTRUCTURE: t.projects.filterInfrastructure,
        BACKEND: t.projects.filterBackend,
        PLATFORM: t.projects.filterPlatform,
        'ARTIFICIAL INTELLIGENCE': t.projects.filterAi,
    };

    const filteredProjects = filter === 'ALL'
        ? PROJECTS
        : PROJECTS.filter(p => p.category === filter);

    const glitchVariants = {
        glitch: {
            x: [0, -5, 5, -2, 2, 0],
            y: [0, 2, -2, 1, -1, 0],
            color: ["#9c3b28", "#b98a26", "#3d6a82", "#9c3b28"],
            transition: {
                duration: 0.2,
                repeat: 3,
                ease: "linear" as const
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full flex-grow"
        >
            <header className="container mx-auto px-6 md:px-12 lg:px-24 pt-32 md:pt-28 pb-20 md:pb-24">
                <motion.div variants={itemVariants} className="relative">
                    <div className="mb-6"><span className="kicker">{t.projects.kicker}</span></div>
                    <h1 className="masthead uppercase mb-8 select-none">
                        {t.projects.titleLead}{' '}
                        <motion.span
                            animate={worksClickCount >= 5 ? "glitch" : ""}
                            variants={glitchVariants}
                            onAnimationComplete={() => worksClickCount >= 5 && setWorksClickCount(0)}
                            onClick={() => setWorksClickCount(prev => prev + 1)}
                            className="headline-accent inline-block cursor-pointer"
                        >
                            {t.projects.titleAccent}
                        </motion.span>
                    </h1>
                    <div className="rule-double mb-8 max-w-3xl" />
                    <p className="standfirst measure">
                        {rich(t.projects.standfirst)}
                    </p>
                </motion.div>
            </header>

            <main className="container mx-auto px-6 md:px-12 lg:px-24 pb-32">
                <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-8 items-center justify-between border-b-2 border-ink pb-4">
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10px] tracking-[0.22em] uppercase font-bold">
                        <span className="text-ink">{t.projects.sortedBy}</span>
                        <span className="text-ink-muted">{t.projects.totalLabel} <span className="marker">{filteredProjects.length} {t.projects.totalUnit}</span></span>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                        {PROJECT_FILTERS.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`inline-flex min-h-11 items-center border px-4 text-[10px] font-bold tracking-[0.14em] transition-colors ${filter === cat
                                    ? 'bg-ink border-ink text-paper-raised'
                                    : 'border-rule-strong text-ink-muted hover:border-ink hover:text-ink'
                                    }`}
                            >
                                {filterLabels[cat]}
                            </button>
                        ))}
                    </div>
                </motion.div>

                <div className="w-full">
                    {/* The four column reading only holds up once there is room for it.
                       Below lg the same rows ship as cards, so the page body never
                       has to scroll sideways. */}
                    <div className="hidden overflow-x-auto lg:block">
                    <table className="w-full min-w-[52rem] text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] tracking-[0.2em] uppercase text-ink border-y border-rule-strong bg-paper-sunk/70">
                                <th className="py-4 pl-8 font-bold w-1/4">{t.projects.colSystem}</th>
                                <th className="py-4 font-bold w-1/4 border-l border-rule pl-6">{t.projects.colStack}</th>
                                <th className="py-4 font-bold w-1/3 border-l border-rule pl-6">{t.projects.colImpact}</th>
                                <th className="py-4 pr-8 font-bold text-right border-l border-rule pl-6">{t.projects.colDeployment}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-rule">
                            <AnimatePresence mode='popLayout'>
                                {filteredProjects.map((project) => (
                                    <motion.tr
                                        layout
                                        key={project.key}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={`data-row group relative transition-colors duration-200 hover:bg-paper-sunk/70 ${project.detail ? 'cursor-pointer focus-within:bg-paper-sunk/70' : ''}`}
                                    >
                                        <td className="py-12 pl-8 pr-10 align-middle">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="font-headline text-2xl font-bold text-ink group-hover:text-accent transition-colors">
                                                    {project.detail ? (
                                                        /* Real link, stretched over the whole row.
                                                           The row is the positioning context, so the
                                                           anchor keeps its keyboard focus ring while
                                                           the mouse target is the full width. */
                                                        <Link
                                                            to={project.detail}
                                                            className="after:absolute after:inset-0 after:content-['']"
                                                        >
                                                            {project.title}
                                                        </Link>
                                                    ) : (
                                                        project.title
                                                    )}
                                                </span>
                                                <span className="text-[11px] tracking-[0.12em] text-ink-muted uppercase">{copy[project.key].subtitle}</span>
                                            </div>
                                        </td>
                                        <td className="py-12 pr-10 pl-6 align-middle border-l border-rule">
                                            <div className="flex flex-wrap gap-2">
                                                {project.stack.map(tech => (
                                                    /* lang="en" keeps CSS uppercasing off the Turkish
                                                       casing rules: Nginx is NGINX, never NGİNX. */
                                                    <span key={tech} lang="en" className="text-[11px] px-2 py-0.5 rounded-sm border border-rule bg-paper-raised text-ink-muted uppercase tracking-[0.08em]">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-12 pr-10 pl-6 align-middle border-l border-rule">
                                            <p
                                                className="text-sm text-ink-body leading-relaxed max-w-lg"
                                                dangerouslySetInnerHTML={{ __html: copy[project.key].impact }}
                                            />
                                        </td>
                                        <td className="py-12 pr-8 pl-6 align-middle text-right border-l border-rule">
                                            <div className="flex flex-col items-end gap-3">
                                                <div className="flex justify-end gap-5 opacity-70 group-hover:opacity-100 transition-opacity">
                                                    {project.demo && (
                                                        <a
                                                            className="relative z-10 flex h-11 w-11 items-center justify-center text-ink-muted transition-colors hover:text-accent"
                                                            href={project.demo}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title={t.projects.liveSite}
                                                            aria-label={`${project.title}, ${t.projects.liveSite}`}
                                                        >
                                                            <ExternalLink size={18} />
                                                        </a>
                                                    )}
                                                    {project.github && (
                                                        <a
                                                            className="relative z-10 flex h-11 w-11 items-center justify-center text-ink-muted transition-colors hover:text-accent"
                                                            href={project.github}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title={t.projects.repository}
                                                            aria-label={`${project.title}, ${t.projects.repository}`}
                                                        >
                                                            <Terminal size={18} />
                                                        </a>
                                                    )}
                                                </div>
                                                {project.detail && (
                                                    <span
                                                        aria-hidden="true"
                                                        className="folio whitespace-nowrap normal-case tracking-[0.14em] text-ink-muted transition-colors group-hover:text-accent"
                                                    >
                                                        {t.projects.readCase} &rarr;
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                    </div>

                    {/* Card view for narrow and tablet widths */}
                    <div className="space-y-8 lg:hidden">
                        <AnimatePresence mode='popLayout'>
                            {filteredProjects.map((project) => (
                                <motion.div
                                    layout
                                    key={project.key}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="paper-panel relative border-t-2 border-t-ink p-5 space-y-4 focus-within:bg-paper-sunk/70"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 flex-col gap-1">
                                            <span className="font-headline text-xl font-bold text-ink">
                                                {project.detail ? (
                                                    <Link
                                                        to={project.detail}
                                                        className="after:absolute after:inset-0 after:content-['']"
                                                    >
                                                        {project.title}
                                                    </Link>
                                                ) : (
                                                    project.title
                                                )}
                                            </span>
                                            <span className="text-[11px] tracking-[0.14em] text-ink-muted uppercase">{copy[project.key].subtitle}</span>
                                        </div>
                                        <div className="-mr-2 flex shrink-0 gap-1">
                                            {project.demo && (
                                                <a
                                                    href={project.demo}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={`${project.title}, ${t.projects.liveSite}`}
                                                    className="relative z-10 flex h-11 w-11 items-center justify-center text-ink-muted transition-colors hover:text-accent"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            )}
                                            {project.github && (
                                                <a
                                                    href={project.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={`${project.title}, ${t.projects.repository}`}
                                                    className="relative z-10 flex h-11 w-11 items-center justify-center text-ink-muted transition-colors hover:text-accent"
                                                >
                                                    <Terminal size={16} />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {project.stack.map(tech => (
                                            <span key={tech} lang="en" className="text-[10px] px-2 py-0.5 rounded-sm border border-rule text-ink-muted uppercase tracking-[0.08em]">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    <p
                                        className="border-t border-rule pt-3 text-[15px] leading-relaxed text-ink-body"
                                        dangerouslySetInnerHTML={{ __html: copy[project.key].impact }}
                                    />

                                    {project.detail && (
                                        <p aria-hidden="true" className="folio border-t border-rule pt-3 normal-case tracking-[0.14em] text-ink-muted">
                                            {t.projects.readCase} &rarr;
                                        </p>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                <motion.div variants={itemVariants} className="mt-20 flex justify-center">
                    <button className="border border-ink px-10 py-4 text-center text-[11px] tracking-[0.2em] uppercase font-bold text-ink hover:bg-ink hover:text-paper-raised transition-colors duration-300">
                        {t.projects.requestPortfolio}
                    </button>
                </motion.div>
            </main>
        </motion.div>
    );
};

export default Projects;

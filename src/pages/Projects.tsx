import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Terminal } from 'lucide-react';

interface Project {
    id: number;
    title: string;
    subtitle: string;
    category: 'INFRASTRUCTURE' | 'BACKEND' | 'PLATFORM' | 'ARTIFICIAL INTELLIGENCE' | 'FRONTEND' | 'NETWORKING';
    stack: string[];
    impact: string;
    github?: string;
    demo?: string;
}

const projects: Project[] = [
    {
        id: 1,
        title: "CRMSolid Ecosystem",
        subtitle: "Omnichannel SaaS Architecture",
        category: "BACKEND",
        stack: [".NET 8", "C#", "PostgreSQL", "Redis"],
        impact: "Architected a comprehensive system bridging cloud backends with desktop agents to orchestrate <span class='text-white font-medium'>16+ communication channels</span>, ensuring 99.9% service continuity.",
        demo: "https://crmsolid.com/"
    },
    {
        id: 2,
        title: "NerioPanel",
        subtitle: "Multi-Tenant SaaS Platform",
        category: "PLATFORM",
        stack: [".NET 8", "React", "PowerDNS", "Nginx"],
        impact: "Architected a white-label hosting system allowing resellers to deploy branded panels via custom domains, featuring <span class='text-white font-medium'>automatic SSL provisioning</span> and strict Row-Level Security.",
        demo: "https://neriopanel.com/"
    },
    {
        id: 3,
        title: "Evelynn",
        subtitle: "High-Concurrency Automation Kernel",
        category: "INFRASTRUCTURE",
        stack: ["C#", "TPL", "Async/Await", "SQLite"],
        impact: "Developed a multi-threaded execution engine managing <span class='text-white font-medium'>20+ concurrent sessions</span> with heuristic patterns to simulate organic user behavior and bypass detection.",
        github: "https://github.com/azorkai/EvelynnBot"
    },
    {
        id: 4,
        title: "Semantic Lead Engine",
        subtitle: "AI Lead Qualification",
        category: "ARTIFICIAL INTELLIGENCE",
        stack: ["GPT-4o", "OpenAI", ".NET"],
        impact: "Automated intent analysis and lead qualification from live Telegram streams using <span class='text-white font-medium'>GPT-4o semantic processing</span>, reducing manual filtering by 70%.",
    },
    {
        id: 5,
        title: "Commerce Pipeline",
        subtitle: "High-Traffic Order Processing",
        category: "BACKEND",
        stack: ["PHP", "MySQL", "Redis", "Stripe"],
        impact: "Optimized a high-traffic Digital Marketing platform handling <span class='text-white font-medium'>10,000+ daily transactions</span>, achieving a 40% reduction in server load through strategic indexing.",
    }
];

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
    const [filter, setFilter] = useState<'ALL' | 'INFRASTRUCTURE' | 'BACKEND' | 'PLATFORM' | 'ARTIFICIAL INTELLIGENCE'>('ALL');
    const [worksClickCount, setWorksClickCount] = useState(0);

    const filteredProjects = filter === 'ALL'
        ? projects
        : projects.filter(p => p.category === filter);

    const glitchVariants = {
        glitch: {
            x: [0, -5, 5, -2, 2, 0],
            y: [0, 2, -2, 1, -1, 0],
            color: ["#fff", "#f0f", "#0ff", "#fff"],
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
            <header className="container mx-auto px-6 md:px-24 pt-32 md:pt-12 pb-16">
                <motion.div variants={itemVariants} className="relative">
                    <span className="block text-[10px] tracking-[0.4em] mb-4 text-text-muted dark:text-gray-500 uppercase">Architecture & Shipments</span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold uppercase leading-none tracking-tighter mb-8 select-none">
                        The <motion.span
                            animate={worksClickCount >= 5 ? "glitch" : ""}
                            variants={glitchVariants}
                            onAnimationComplete={() => worksClickCount >= 5 && setWorksClickCount(0)}
                            onClick={() => setWorksClickCount(prev => prev + 1)}
                            className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white inline-block cursor-pointer"
                        >
                            Works
                        </motion.span>
                    </h1>
                    <p className="max-w-2xl text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                        Architecting scalable SaaS solutions and high-throughput automation systems. Specialized in performance-critical CRM platforms and resilient API integrations.
                    </p>
                </motion.div>
            </header>

            <main className="container mx-auto px-6 md:px-24 pb-32">
                <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-8 items-center justify-between border-b border-gray-300 dark:border-gray-800 pb-6">
                    <div className="flex gap-6 text-[10px] tracking-widest uppercase font-bold">
                        <span className="text-black dark:text-white">Sorted by: Impact</span>
                        <span className="text-text-muted">Total: {filteredProjects.length} Systems</span>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                        {(['ALL', 'INFRASTRUCTURE', 'BACKEND', 'PLATFORM', 'ARTIFICIAL INTELLIGENCE'] as const).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-3 py-1 text-[10px] font-bold tracking-widest transition-colors ${filter === cat
                                    ? 'bg-black dark:bg-white text-white dark:text-black'
                                    : 'border border-gray-300 dark:border-gray-700 text-text-muted hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </motion.div>

                <div className="w-full">
                    <table className="w-full text-left border-collapse hidden md:table">
                        <thead>
                            <tr className="text-[10px] tracking-[0.2em] uppercase text-gray-500 border-b border-gray-300 dark:border-gray-800">
                                <th className="py-6 pl-8 font-semibold w-1/4">Project System</th>
                                <th className="py-6 font-semibold w-1/4">Stack</th>
                                <th className="py-6 font-semibold w-1/3">Key Impact & Technical Outcome</th>
                                <th className="py-6 pr-8 font-semibold text-right">Deployment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300 dark:divide-gray-800">
                            <AnimatePresence mode='popLayout'>
                                {filteredProjects.map((project) => (
                                    <motion.tr
                                        layout
                                        key={project.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="data-row group hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
                                    >
                                        <td className="py-12 pl-8 pr-10 align-middle">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-xl font-bold group-hover:text-black dark:group-hover:text-white transition-colors">{project.title}</span>
                                                <span className="text-[10px] tracking-wider font-mono text-gray-500 uppercase">{project.subtitle}</span>
                                            </div>
                                        </td>
                                        <td className="py-12 pr-10 align-middle">
                                            <div className="flex flex-wrap gap-2">
                                                {project.stack.map(tech => (
                                                    <span key={tech} className="text-[9px] px-2 py-0.5 border border-gray-300 dark:border-gray-700 text-gray-400 font-mono uppercase tracking-tight">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-12 pr-10 align-middle">
                                            <p
                                                className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg"
                                                dangerouslySetInnerHTML={{ __html: project.impact }}
                                            />
                                        </td>
                                        <td className="py-12 pr-8 align-middle text-right">
                                            <div className="flex justify-end gap-5 opacity-40 group-hover:opacity-100 transition-opacity">
                                                {project.demo && (
                                                    <a
                                                        className="text-gray-500 hover:text-black dark:hover:text-white transition-transform hover:scale-110"
                                                        href={project.demo}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="Live Demo"
                                                    >
                                                        <ExternalLink size={18} />
                                                    </a>
                                                )}
                                                {project.github && (
                                                    <a
                                                        className="text-gray-500 hover:text-black dark:hover:text-white transition-transform hover:scale-110"
                                                        href={project.github}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="GitHub Repository"
                                                    >
                                                        <Terminal size={18} />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-8">
                        <AnimatePresence mode='popLayout'>
                            {filteredProjects.map((project) => (
                                <motion.div
                                    layout
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="border border-gray-300 dark:border-gray-800 p-6 rounded-sm space-y-4"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xl font-bold text-black dark:text-white">{project.title}</span>
                                            <span className="text-[9px] tracking-wider font-mono text-gray-500 uppercase">{project.subtitle}</span>
                                        </div>
                                        <div className="flex gap-4">
                                            {project.demo && (
                                                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-gray-500">
                                                    <ExternalLink size={16} />
                                                </a>
                                            )}
                                            {project.github && (
                                                <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-gray-500">
                                                    <Terminal size={16} />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {project.stack.map(tech => (
                                            <span key={tech} className="text-[8px] px-2 py-0.5 border border-gray-300 dark:border-gray-700 text-gray-400 font-mono uppercase tracking-tight">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    <p
                                        className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed pt-2"
                                        dangerouslySetInnerHTML={{ __html: project.impact }}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                <motion.div variants={itemVariants} className="mt-16 flex justify-center">
                    <button className="border border-gray-300 dark:border-gray-700 px-8 py-4 text-xs tracking-[0.2em] uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300">
                        Request Full Technical Portfolio
                    </button>
                </motion.div>
            </main>
        </motion.div>
    );
};

export default Projects;

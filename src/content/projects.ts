/* ---------------------------------------------------------------------------
 *  Project index: the parts that never change between editions.
 *
 *  Titles are product names, the stack chips are technology names, and URLs
 *  are URLs. Only the subtitle and the impact paragraph get translated, and
 *  those live in projects.en.ts / projects.tr.ts.
 * ------------------------------------------------------------------------- */

export type ProjectCategory =
    | 'INFRASTRUCTURE'
    | 'BACKEND'
    | 'PLATFORM'
    | 'ARTIFICIAL INTELLIGENCE';

export type ProjectFilter = 'ALL' | ProjectCategory;

export type ProjectKey =
    | 'crmsolid'
    | 'playersells'
    | 'neriopanel'
    | 'evelynn'
    | 'leadScoring'
    | 'commerce';

export interface ProjectBase {
    key: ProjectKey;
    title: string;
    category: ProjectCategory;
    stack: string[];
    github?: string;
    demo?: string;
    /** Only set where a full case study exists on this site. */
    detail?: string;
}

export const PROJECTS: ProjectBase[] = [
    {
        key: 'crmsolid',
        title: 'CRMSolid',
        category: 'BACKEND',
        stack: ['.NET 9', 'C#', 'PostgreSQL', 'Docker'],
        demo: 'https://crmsolid.com/',
        detail: '/projects/crmsolid',
    },
    {
        key: 'playersells',
        title: 'PlayerSells',
        category: 'PLATFORM',
        stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Python', 'Docker'],
        demo: 'https://playersells.com/',
        detail: '/projects/playersells',
    },
    {
        key: 'neriopanel',
        title: 'NerioPanel',
        category: 'PLATFORM',
        stack: ['.NET 8', 'React', 'PowerDNS', 'Nginx'],
        demo: 'https://neriopanel.com/',
    },
    {
        key: 'evelynn',
        title: 'Evelynn',
        category: 'INFRASTRUCTURE',
        stack: ['C#', 'TPL', 'Async/Await'],
        github: 'https://github.com/azorkai/EvelynnBot',
    },
    {
        key: 'leadScoring',
        title: 'Lead Scoring Engine',
        category: 'ARTIFICIAL INTELLIGENCE',
        stack: ['Anthropic API', 'OpenAI API', '.NET'],
    },
    {
        key: 'commerce',
        title: 'Commerce Pipeline',
        category: 'BACKEND',
        stack: ['PHP', 'MySQL', 'Redis', 'Stripe'],
    },
];

export const PROJECT_FILTERS: ProjectFilter[] = [
    'ALL',
    'INFRASTRUCTURE',
    'BACKEND',
    'PLATFORM',
    'ARTIFICIAL INTELLIGENCE',
];

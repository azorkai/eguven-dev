/* ---------------------------------------------------------------------------
 *  PlayerSells case study: the parts that do not get translated.
 *
 *  Section ids (they are URL fragments), image paths and public URLs live here
 *  once. The prose lives in playersells.en.ts and playersells.tr.ts.
 * ------------------------------------------------------------------------- */

export const PS_SECTION_IDS = [
    'problem',
    'architecture',
    'rank',
    'framing',
    'insights',
    'guard',
    'graph',
    'seo',
    'failures',
    'stack',
    'numbers',
    'links',
] as const;

export type PsSectionId = (typeof PS_SECTION_IDS)[number];

/** Two digit folio numbers, in reading order, matching PS_SECTION_IDS. */
export const PS_SECTION_NUMBERS: Record<PsSectionId, string> = {
    problem: '01',
    architecture: '02',
    rank: '03',
    framing: '04',
    insights: '05',
    guard: '06',
    graph: '07',
    seo: '08',
    failures: '09',
    stack: '10',
    numbers: '11',
    links: '12',
};

export type PsLinkKey = 'tools' | 'rank' | 'insights' | 'data' | 'site';

export const PS_LINKS: { key: PsLinkKey; name: string; href: string }[] = [
    { key: 'tools', name: 'playersells.com/tools', href: 'https://playersells.com/tools' },
    {
        key: 'rank',
        name: 'twitter-follower-rank',
        href: 'https://playersells.com/tools/twitter-follower-rank',
    },
    { key: 'insights', name: 'playersells.com/insights', href: 'https://playersells.com/insights' },
    { key: 'data', name: 'insights/data.json', href: 'https://playersells.com/insights/data.json' },
    { key: 'site', name: 'playersells.com', href: 'https://playersells.com' },
];

/* Captured from the live public site. Nothing here shows a buyer, a seller,
   a dashboard, a message or anything behind authentication: the only handle
   on any of them is a large public account whose follower count the site
   already publishes. Folder is /media, never /projects, because that name
   collides with the /projects/* route and answers 301. */
export const PS_IMAGES = {
    rankResult: { src: '/media/playersells/rank-result.png', width: 1600, height: 1507 },
    rankLadder: { src: '/media/playersells/rank-distribution.png', width: 1600, height: 964 },
    tiktok: { src: '/media/playersells/rank-tiktok-caveat.png', width: 1600, height: 540 },
    insights: { src: '/media/playersells/insights-benchmark.png', width: 1600, height: 790 },
    tools: { src: '/media/playersells/tools-hub.png', width: 1400, height: 1450 },
};

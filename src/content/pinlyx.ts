/* ---------------------------------------------------------------------------
 *  Pinlyx case study: the parts that do not get translated.
 *
 *  Section ids (they are URL fragments), image paths and repository URLs live
 *  here once. The prose lives in pinlyx.en.ts and pinlyx.tr.ts.
 * ------------------------------------------------------------------------- */

export const PINLYX_SECTION_IDS = [
    'problem',
    'architecture',
    'catalogue',
    'mcp',
    'tenancy',
    'flood',
    'realtime',
    'operations',
    'failures',
    'stack',
    'numbers',
    'links',
] as const;

export type PinlyxSectionId = (typeof PINLYX_SECTION_IDS)[number];

/** Two digit folio numbers, in reading order, matching PINLYX_SECTION_IDS. */
export const PINLYX_SECTION_NUMBERS: Record<PinlyxSectionId, string> = {
    problem: '01',
    architecture: '02',
    catalogue: '03',
    mcp: '04',
    tenancy: '05',
    flood: '06',
    realtime: '07',
    operations: '08',
    failures: '09',
    stack: '10',
    numbers: '11',
    links: '12',
};

export type PinlyxLinkKey = 'dotnet' | 'mcp' | 'clipper' | 'site';

export const PINLYX_LINKS: { key: PinlyxLinkKey; name: string; href: string }[] = [
    { key: 'dotnet', name: 'pinlyx-dotnet', href: 'https://github.com/Pinlyx/pinlyx-dotnet' },
    { key: 'mcp', name: 'pinlyx-mcp', href: 'https://github.com/Pinlyx/pinlyx-mcp' },
    { key: 'clipper', name: 'pinlyx-clipper', href: 'https://github.com/Pinlyx/pinlyx-clipper' },
    { key: 'site', name: 'pinlyx.com', href: 'https://pinlyx.com' },
];

export const PINLYX_IMAGES = {
    inbox: { src: '/media/pinlyx/panel-inbox.png', width: 1600, height: 1000 },
    pipeline: { src: '/media/pinlyx/panel-pipeline.png', width: 1600, height: 1000 },
    mcp: { src: '/media/pinlyx/mcp-package.png', width: 1280, height: 640 },
    agents: { src: '/media/pinlyx/panel-ai-agents.png', width: 1600, height: 1000 },
};

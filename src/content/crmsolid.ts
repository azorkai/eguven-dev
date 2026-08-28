/* ---------------------------------------------------------------------------
 *  CRMSolid case study: the parts that do not get translated.
 *
 *  Section ids (they are URL fragments), image paths and repository URLs live
 *  here once. The prose lives in crmsolid.en.ts and crmsolid.tr.ts.
 * ------------------------------------------------------------------------- */

export const CRM_SECTION_IDS = [
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

export type CrmSectionId = (typeof CRM_SECTION_IDS)[number];

/** Two digit folio numbers, in reading order, matching CRM_SECTION_IDS. */
export const CRM_SECTION_NUMBERS: Record<CrmSectionId, string> = {
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

export type CrmLinkKey = 'dotnet' | 'mcp' | 'clipper' | 'site';

export const CRM_LINKS: { key: CrmLinkKey; name: string; href: string }[] = [
    { key: 'dotnet', name: 'crmsolid-dotnet', href: 'https://github.com/CRM-Solid/crmsolid-dotnet' },
    { key: 'mcp', name: 'crmsolid-mcp', href: 'https://github.com/CRM-Solid/crmsolid-mcp' },
    { key: 'clipper', name: 'crmsolid-clipper', href: 'https://github.com/CRM-Solid/crmsolid-clipper' },
    { key: 'site', name: 'crmsolid.com', href: 'https://crmsolid.com' },
];

export const CRM_IMAGES = {
    inbox: { src: '/projects/crmsolid/panel-inbox.png', width: 1600, height: 1000 },
    pipeline: { src: '/projects/crmsolid/panel-pipeline.png', width: 1600, height: 1000 },
    mcp: { src: '/projects/crmsolid/mcp-package.png', width: 1280, height: 640 },
    agents: { src: '/projects/crmsolid/panel-ai-agents.png', width: 1600, height: 1000 },
};

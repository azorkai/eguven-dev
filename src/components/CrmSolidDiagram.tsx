import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/useLanguage';
import { crmsolidEn, type CrmSolidContent } from '../content/crmsolid.en';
import { crmsolidTr } from '../content/crmsolid.tr';

/* ---------------------------------------------------------------------------
 *  CRMSolid runtime diagram.
 *
 *  Two layouts, one at a time in the DOM so a screen reader is not handed the
 *  same picture twice. Wide is a left to right read: clients, edge, server.
 *  Narrow stacks the same nodes into a single column, because a 1000 unit wide
 *  drawing squeezed into a phone is a picture of nothing.
 *
 *  Every colour is a theme variable, so the drawing re-inks itself with the
 *  rest of the page in the night edition. Palette is one accent plus grey: the
 *  accent is spent on the one path that leaves the user's own machine.
 *
 *  Labels and the long description come from the case study content module, so
 *  the drawing is captioned in whichever edition the reader is on. Product and
 *  hostname strings are the same in both.
 * ------------------------------------------------------------------------- */

const INK = 'var(--color-ink)';
const MUTED = 'var(--color-ink-muted)';
const FAINT = 'var(--color-ink-faint)';
const RULE = 'var(--color-rule-strong)';
const PAPER = 'var(--color-paper-raised)';
const SUNK = 'var(--color-paper-sunk)';
const ACCENT = 'var(--color-accent)';

const TITLE_ID = 'crmsolid-diagram-title';
const DESC_ID = 'crmsolid-diagram-desc';

type Labels = CrmSolidContent['diagram'];

/* ---- primitives --------------------------------------------------------- */

type BoxProps = {
    x: number;
    y: number;
    w: number;
    h: number;
    title: string;
    sub?: string;
    accent?: boolean;
    strong?: boolean;
    fill?: string;
    titleSize?: number;
    subSize?: number;
};

const Box = ({
    x, y, w, h, title, sub, accent, strong, fill = PAPER, titleSize = 10, subSize = 8.2,
}: BoxProps) => (
    <g>
        <rect
            x={x} y={y} width={w} height={h} rx="2"
            fill={fill}
            stroke={accent ? ACCENT : strong ? INK : RULE}
            strokeWidth={accent || strong ? 1.4 : 1}
        />
        {title && (
            <text
                x={x + 10}
                y={sub ? y + h / 2 - 1 : y + h / 2 + 3.5}
                fontSize={titleSize}
                fontWeight="700"
                fill={accent ? ACCENT : INK}
            >
                {title}
            </text>
        )}
        {sub && (
            <text x={x + 10} y={y + h / 2 + 11} fontSize={subSize} fill={MUTED}>
                {sub}
            </text>
        )}
    </g>
);

type LineProps = { d: string; dash?: string; accent?: boolean };

const Line = ({ d, dash, accent }: LineProps) => (
    <path
        d={d}
        fill="none"
        stroke={accent ? ACCENT : MUTED}
        strokeWidth={accent ? 1.4 : 1}
        strokeDasharray={dash}
        markerEnd={accent ? 'url(#cs-head-accent)' : 'url(#cs-head)'}
    />
);

type TagProps = {
    x: number;
    y: number;
    children: React.ReactNode;
    anchor?: 'start' | 'middle' | 'end';
    accent?: boolean;
    size?: number;
};

const Tag = ({ x, y, children, anchor = 'start', accent, size = 8 }: TagProps) => (
    <text x={x} y={y} fontSize={size} textAnchor={anchor} fill={accent ? ACCENT : FAINT}>
        {children}
    </text>
);

const Band = ({ x, y, children }: { x: number; y: number; children: string }) => (
    <text x={x} y={y} fontSize="8.5" fontWeight="700" letterSpacing="0.18em" fill={FAINT}>
        {children}
    </text>
);

const Defs = () => (
    <defs>
        <marker id="cs-head" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 Z" fill={MUTED} />
        </marker>
        <marker id="cs-head-accent" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 Z" fill={ACCENT} />
        </marker>
    </defs>
);

/* ---- wide layout, 1000 x 510 -------------------------------------------- */

const Wide = ({ d }: { d: Labels }) => (
    <svg
        viewBox="0 0 1000 510"
        width={1000}
        height={510}
        role="img"
        aria-labelledby={`${TITLE_ID} ${DESC_ID}`}
        className="block h-auto w-full font-serif"
        style={{ maxWidth: 1000 }}
    >
        <title id={TITLE_ID}>{d.title}</title>
        <desc id={DESC_ID}>{d.desc}</desc>
        <Defs />

        <Band x={30} y={13}>{d.bandClients}</Band>
        <Band x={250} y={13}>{d.bandEdge}</Band>
        <Band x={500} y={13}>{d.bandServer}</Band>

        {/* clients */}
        <Box x={30} y={26} w={182} h={44} title={d.browser} sub={d.browserSub} />
        <Box x={30} y={80} w={182} h={44} title={d.assistant} sub={d.assistantSub} titleSize={9.5} subSize={7.5} />
        <Box x={30} y={134} w={182} h={44} title={d.widget} sub={d.widgetSub} subSize={7.5} />
        <Box x={30} y={188} w={182} h={44} title={d.desktop} sub={d.desktopSub} subSize={7.5} />
        <Box x={30} y={276} w={140} h={38} title="Telegram MTProto" accent titleSize={9.5} />

        <Line d="M74,232 V272" accent />
        <Tag x={82} y={258} accent>{d.userIp}</Tag>

        {/* clients into the edge */}
        <Line d="M212,48 H248" />
        <Line d="M212,102 H248" />
        <Line d="M212,156 H248" />
        <Line d="M212,210 H248" />

        {/* edge */}
        <Box x={250} y={26} w={118} h={206} title="" />
        <text x={309} y={118} fontSize="11.5" fontWeight="700" textAnchor="middle" fill={INK}>Traefik 3.1</text>
        <text x={309} y={136} fontSize="7.6" textAnchor="middle" fill={MUTED}>{d.traefikTls}</text>
        <text x={309} y={149} fontSize="7.6" textAnchor="middle" fill={MUTED}>{d.traefikRedirect}</text>

        {/* edge into the server, one arrow per hostname */}
        <Line d="M368,46 H498" />
        <Tag x={433} y={40} anchor="middle">crmsolid.com</Tag>
        <Line d="M368,96 H498" />
        <Tag x={433} y={90} anchor="middle">app.crmsolid.com</Tag>
        <Line d="M368,146 H498" />
        <Tag x={433} y={140} anchor="middle">health.crmsolid.com</Tag>
        <Line d="M368,210 H498" />
        <Tag x={433} y={204} anchor="middle">api.crmsolid.com</Tag>

        {/* server */}
        <Box x={500} y={26} w={240} h={40} title={d.landing} sub={d.landingSub} />
        <Box x={500} y={76} w={240} h={40} title={d.panel} sub={d.panelSub} />
        <Box x={500} y={126} w={240} h={40} title={d.health} sub={d.healthSub} />

        <rect x={500} y={180} width={240} height={248} rx="2" fill={SUNK} stroke={INK} strokeWidth="1.4" />
        <text x={512} y={200} fontSize="11.5" fontWeight="700" fill={INK}>TelegramSimple API</text>
        <text x={512} y={213} fontSize="8.2" fill={MUTED}>{d.apiSub}</text>

        <Box x={512} y={226} w={216} h={34} title={d.rest} sub={d.restSub} titleSize={9.5} />
        <Box x={512} y={265} w={216} h={34} title={d.mcp} sub={d.mcpSub} titleSize={9.5} strong />
        <Box x={512} y={304} w={216} h={34} title={d.hubs} sub={d.hubsSub} titleSize={9.5} />
        <Box x={512} y={343} w={216} h={34} title={d.workers} sub={d.workersSub} titleSize={9.5} />
        <Box x={512} y={382} w={216} h={34} title={d.context} sub={d.contextSub} titleSize={9.5} />

        {/* the health monitor watches from outside the container */}
        <Line d="M740,146 H768 V243 H728" dash="4 3" />
        <Tag x={774} y={200}>{d.probes}</Tag>

        {/* stores */}
        <Box x={820} y={276} w={172} h={34} title="Overture Maps S3" sub={d.overtureSub} titleSize={9.5} />
        <Box x={820} y={343} w={172} h={34} title="Redis" sub={d.redisSub} />
        <Box x={820} y={382} w={172} h={34} title="PostgreSQL 16" sub={d.postgresSub} />

        <Line d="M728,352 L818,300" dash="2 3" />
        <Line d="M728,360 H818" />
        <Line d="M728,399 H818" />
        <Tag x={773} y={393} anchor="middle">binary COPY</Tag>

        {/* live updates back out to the browser and the widget */}
        <Line d="M512,321 H486 V490 H16 V48 H28" dash="4 3" />
        <Line d="M16,156 H28" dash="4 3" />
        <Tag x={150} y={484}>{d.liveUpdates}</Tag>
    </svg>
);

/* ---- stacked layout, 380 x 860 ------------------------------------------ */

const Stacked = ({ d }: { d: Labels }) => (
    <svg
        viewBox="0 0 380 860"
        width={380}
        height={860}
        role="img"
        aria-labelledby={`${TITLE_ID} ${DESC_ID}`}
        className="mx-auto block h-auto w-full font-serif"
        style={{ maxWidth: 430 }}
    >
        <title id={TITLE_ID}>{d.title}</title>
        <desc id={DESC_ID}>{d.desc}</desc>
        <Defs />

        <Band x={32} y={13}>{d.bandClients}</Band>
        <Box x={32} y={22} w={316} h={38} title={d.browser} sub={d.browserSub} />
        <Box x={32} y={66} w={316} h={38} title={d.assistant} sub={d.assistantSub} />
        <Box x={32} y={110} w={316} h={38} title={d.widget} sub={d.widgetSub} />
        <Box x={32} y={154} w={176} h={38} title={d.desktop} sub={d.desktopSub} titleSize={9} subSize={7.2} />
        <Box x={226} y={154} w={122} h={38} title="Telegram MTProto" accent titleSize={9} />
        <Line d="M208,173 H222" accent />
        <Tag x={217} y={206} anchor="middle" accent>{d.userIp}</Tag>

        <Line d="M100,192 V228" />

        <Band x={32} y={222}>{d.bandEdge}</Band>
        <Box x={32} y={232} w={316} h={64} title="" />
        <text x={44} y={250} fontSize="10.5" fontWeight="700" fill={INK}>Traefik 3.1</text>
        <text x={44} y={264} fontSize="8.2" fill={MUTED}>{d.traefikTlsStacked}</text>
        <text x={44} y={278} fontSize="8.2" fill={MUTED}>crmsolid.com, app., api., health.crmsolid.com</text>

        <Line d="M100,296 V330" />

        <Band x={32} y={318}>{d.bandServer}</Band>
        <Box x={32} y={334} w={316} h={36} title={d.landing} sub={d.landingSub} />
        <Box x={32} y={376} w={316} h={36} title={d.panel} sub={d.panelSub} />
        <Box x={32} y={418} w={316} h={36} title={d.health} sub={d.healthSub} />

        <rect x={32} y={468} width={316} height={234} rx="2" fill={SUNK} stroke={INK} strokeWidth="1.4" />
        <text x={44} y={488} fontSize="10.5" fontWeight="700" fill={INK}>TelegramSimple API</text>
        <text x={44} y={501} fontSize="8.2" fill={MUTED}>{d.apiSub}</text>

        <Box x={44} y={512} w={292} h={32} title={d.rest} sub={d.restSub} titleSize={9.5} />
        <Box x={44} y={549} w={292} h={32} title={d.mcp} sub={d.mcpSub} titleSize={9.5} strong />
        <Box x={44} y={586} w={292} h={32} title={d.hubs} sub={d.hubsSub} titleSize={9.5} />
        <Box x={44} y={623} w={292} h={32} title={d.workers} sub={d.workersSub} titleSize={9.5} />
        <Box x={44} y={660} w={292} h={32} title={d.context} sub={d.contextSub} titleSize={9.5} />

        {/* the health monitor watches from outside the container */}
        <Line d="M320,454 V512" dash="4 3" />
        <Tag x={314} y={490} anchor="end">{d.probes}</Tag>

        {/* stores */}
        <Box x={32} y={718} w={316} h={36} title="PostgreSQL 16" sub={d.postgresSubStacked} />
        <Box x={32} y={760} w={316} h={36} title="Redis" sub={d.redisSub} />
        <Box x={32} y={802} w={316} h={36} title="Overture Maps S3" sub={d.overtureSub} />

        <Line d="M300,702 V712 H362 V820 H352" />
        <Line d="M362,736 H352" />
        <Line d="M362,778 H352" />

        {/* live updates back out to the browser and the widget */}
        <Line d="M44,602 H16 V41 H28" dash="4 3" />
        <Line d="M16,129 H28" dash="4 3" />
        <Tag x={22} y={208}>{d.liveUpdatesShort}</Tag>
    </svg>
);

/* ---- picker ------------------------------------------------------------- */

const QUERY = '(min-width: 1024px)';

const CrmSolidDiagram = () => {
    const { lang } = useLanguage();
    const d = (lang === 'tr' ? crmsolidTr : crmsolidEn).diagram;

    const [wide, setWide] = useState(() => {
        try {
            return window.matchMedia(QUERY).matches;
        } catch {
            return true;
        }
    });

    useEffect(() => {
        let mq: MediaQueryList;
        try {
            mq = window.matchMedia(QUERY);
        } catch {
            return;
        }
        const sync = (e: MediaQueryListEvent) => setWide(e.matches);
        mq.addEventListener('change', sync);
        return () => mq.removeEventListener('change', sync);
    }, []);

    return (
        <div className="-mx-1 overflow-x-auto">
            <div className="px-1">{wide ? <Wide d={d} /> : <Stacked d={d} />}</div>
        </div>
    );
};

export default CrmSolidDiagram;

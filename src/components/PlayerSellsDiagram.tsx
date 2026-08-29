import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/useLanguage';
import { playersellsEn, type PlayerSellsContent } from '../content/playersells.en';
import { playersellsTr } from '../content/playersells.tr';

/* ---------------------------------------------------------------------------
 *  PlayerSells runtime diagram.
 *
 *  Same construction as the CRMSolid drawing: two layouts, only one of them in
 *  the DOM at a time so a screen reader is not handed the same picture twice.
 *  Wide reads top to bottom in four bands; narrow stacks the same nodes into a
 *  single column, because a 1000 unit wide drawing squeezed onto a phone is a
 *  picture of nothing.
 *
 *  Every colour is a theme variable, so the drawing re-inks itself with the
 *  page in the night edition. Palette is one accent plus grey, and the accent
 *  is spent on one thing only: the scraper pool that the free tools and seller
 *  verification both drink from.
 *
 *  The line across the middle is the whole point of the picture. Everything
 *  the public pages do either crosses it as a SELECT or does not cross it at
 *  all, and the busiest page on the site is in the second group.
 *
 *  Labels and the long description come from the case study content module, so
 *  the drawing is captioned in whichever edition the reader is on. Table names,
 *  identifiers and product names are the same in both.
 * ------------------------------------------------------------------------- */

const INK = 'var(--color-ink)';
const MUTED = 'var(--color-ink-muted)';
const FAINT = 'var(--color-ink-faint)';
const RULE = 'var(--color-rule-strong)';
const PAPER = 'var(--color-paper-raised)';
const SUNK = 'var(--color-paper-sunk)';
const ACCENT = 'var(--color-accent)';

const TITLE_ID = 'playersells-diagram-title';
const DESC_ID = 'playersells-diagram-desc';

type Labels = PlayerSellsContent['diagram'];

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

type LineProps = { d: string; dash?: string; accent?: boolean; strong?: boolean };

const Line = ({ d, dash, accent, strong }: LineProps) => (
    <path
        d={d}
        fill="none"
        stroke={accent ? ACCENT : strong ? INK : MUTED}
        strokeWidth={strong ? 2 : accent ? 1.4 : 1}
        strokeDasharray={dash}
        markerEnd={accent ? 'url(#ps-head-accent)' : strong ? 'url(#ps-head-strong)' : 'url(#ps-head)'}
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

const Tag = ({ x, y, children, anchor = 'start', accent, size = 7.5 }: TagProps) => (
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
        <marker id="ps-head" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 Z" fill={MUTED} />
        </marker>
        <marker id="ps-head-accent" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 Z" fill={ACCENT} />
        </marker>
        <marker id="ps-head-strong" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 Z" fill={INK} />
        </marker>
    </defs>
);

/* The boundary rule, with its label sitting on the line rather than beside it.
   The backing rectangle is the only reason the text stays readable where the
   rule passes through it. */
const Boundary = ({
    x1, x2, y, cx, bw, label,
}: { x1: number; x2: number; y: number; cx: number; bw: number; label: string }) => (
    <g>
        <path d={`M${x1},${y} H${x2}`} stroke={INK} strokeWidth="2" fill="none" />
        <rect x={cx - bw / 2} y={y - 9} width={bw} height="18" fill={PAPER} />
        <text x={cx} y={y + 3.5} fontSize="8.5" fontWeight="700" textAnchor="middle" fill={INK}>
            {label}
        </text>
    </g>
);

/* ---- wide layout, 1000 x 616 -------------------------------------------- */

const Wide = ({ d }: { d: Labels }) => (
    <svg
        viewBox="0 0 1000 616"
        width={1000}
        height={616}
        role="img"
        aria-labelledby={`${TITLE_ID} ${DESC_ID}`}
        className="block h-auto w-full font-serif"
        style={{ maxWidth: 1000 }}
    >
        <title id={TITLE_ID}>{d.title}</title>
        <desc id={DESC_ID}>{d.desc}</desc>
        <Defs />

        {/* ---- band 1: sources ---- */}
        <Band x={30} y={14}>{d.bandSources}</Band>
        <Box x={30} y={24} w={143} h={44} title="X" sub={d.xSub} titleSize={9.5} subSize={7.2} />
        <Box x={181} y={24} w={143} h={44} title="Telegram" sub={d.telegramSub} titleSize={9.5} subSize={7.2} />
        <Box x={332} y={24} w={143} h={44} title="Bluesky" sub={d.blueskySub} titleSize={9.5} subSize={7.2} />
        <Box x={483} y={24} w={143} h={44} title="TikTok" sub={d.tiktokSub} titleSize={9.5} subSize={7.2} />
        <Box x={634} y={24} w={143} h={44} title="YouTube" sub={d.youtubeSub} titleSize={9.5} subSize={7.2} />
        <Box x={785} y={24} w={143} h={44} title="LinkedIn" sub={d.linkedinSub} titleSize={9.5} subSize={7.2} />

        {/* the one thing on this drawing worth colouring */}
        <path d="M36,68 V76" stroke={ACCENT} strokeWidth="1.4" fill="none" />
        <Tag x={42} y={84} accent size={7}>{d.sharedNote}</Tag>

        <Line d="M155,68 V110" />
        <Line d="M252,68 V110" />
        <Line d="M403,68 V110" />
        <Line d="M554,68 V110" />
        <Line d="M705,68 V110" />
        <Line d="M856,68 V110" />

        {/* ---- band 2: engine stack ---- */}
        <Band x={30} y={104}>{d.bandEngine}</Band>
        <rect x={30} y={112} width={900} height={64} rx="2" fill={SUNK} stroke={INK} strokeWidth="1.4" />
        <Box x={42} y={120} w={213} h={48} title={d.crawlers} sub={d.crawlersSub} titleSize={9.5} subSize={7.4} />
        <Box x={263} y={120} w={213} h={48} title={d.discovery} sub={d.discoverySub} titleSize={9.5} subSize={7.4} />
        <Box x={484} y={120} w={213} h={48} title={d.rollups} sub={d.rollupsSub} titleSize={9.5} subSize={7.4} />
        <Box x={705} y={120} w={213} h={48} title="xlookup" sub={d.xlookupSub} titleSize={9.5} subSize={7.4} strong />
        <Tag x={918} y={192} anchor="end" size={7}>{d.engineNote}</Tag>

        <Line d="M480,176 V202" strong />
        <Tag x={488} y={194}>{d.write}</Tag>

        {/* ---- band 3: the catalog ---- */}
        <Band x={30} y={198}>{d.bandDb}</Band>
        <rect x={30} y={206} width={900} height={86} rx="2" fill={PAPER} stroke={INK} strokeWidth="1.4" />
        <Box x={40} y={214} w={140} h={32} title="xdir_accounts" sub="18.5M rows" titleSize={8.5} subSize={7.2} />
        <Box x={188} y={214} w={140} h={32} title="xedges" sub="79.8M rows" titleSize={8.5} subSize={7.2} />
        <Box x={336} y={214} w={140} h={32} title="xdir_account_engagement" titleSize={8.5} />
        <Box x={484} y={214} w={140} h={32} title="xdir_viral_patterns" titleSize={8.5} />
        <Box x={632} y={214} w={140} h={32} title="xdir_research_findings" titleSize={8.5} />
        <Box x={780} y={214} w={140} h={32} title="scraper.x_tweets" sub="90 day window" titleSize={8.5} subSize={7.2} />
        <Box x={40} y={252} w={140} h={32} title="bdir_accounts" sub="3.8M rows" titleSize={8.5} subSize={7.2} />
        <Box x={188} y={252} w={140} h={32} title="tgdir_chats" sub="3.0M rows" titleSize={8.5} subSize={7.2} />
        <Box x={336} y={252} w={140} h={32} title="ytdir_channels" sub="35.1K rows" titleSize={8.5} subSize={7.2} />
        <Box x={484} y={252} w={140} h={32} title="ttdir_accounts" sub="17.5K rows" titleSize={8.5} subSize={7.2} />
        <Box x={632} y={252} w={140} h={32} title="lidir_*" sub={d.adminSub} titleSize={8.5} subSize={7.2} />
        <Tag x={850} y={272} anchor="middle" size={7}>{d.countsNote}</Tag>

        {/* ---- the read only boundary ---- */}
        <Boundary x1={8} x2={940} y={316} cx={474} bw={176} label={d.boundary} />

        {/* ---- band 4: the app ---- */}
        <Band x={30} y={346}>{d.bandApp}</Band>
        <rect x={30} y={356} width={380} height={214} rx="2" fill={SUNK} stroke={INK} strokeWidth="1.4" />
        <Box x={42} y={366} w={356} h={46} title={d.rank} sub={d.rankSub} titleSize={9.5} />
        <Box x={42} y={420} w={356} h={46} title={d.insights} sub={d.insightsSub} titleSize={9.5} />
        <Box x={42} y={474} w={356} h={46} title={d.tools} sub={d.toolsSub} titleSize={9.5} />
        <Box x={42} y={528} w={356} h={32} title={d.admin} sub={d.adminSub} titleSize={9} subSize={7.4} />

        <Box x={470} y={366} w={210} h={46} title={d.baked} sub={d.bakedSub} titleSize={9.5} subSize={7.2} strong />
        <Box x={470} y={474} w={210} h={46} title="tool-guard" sub={d.guardSub} titleSize={9.5} subSize={7.2} />
        <Box x={470} y={556} w={230} h={40} title={d.seller} sub={d.sellerSub} accent titleSize={9.5} subSize={7.4} />

        <Box x={720} y={366} w={210} h={40} title="Caddy 2" sub={d.caddySub} titleSize={9.5} subSize={7.4} />
        <Box x={720} y={420} w={210} h={40} title="PostgREST 12.2.3" sub={d.postgrestSub} titleSize={9.5} subSize={7.4} />
        <Box x={720} y={474} w={210} h={46} title="Postgres 17" sub={d.marketSub} titleSize={9.5} subSize={7.4} />
        <Line d="M825,406 V416" />
        <Line d="M825,460 V470" />

        {/* the thick path is the busy one, and it never reaches the database */}
        <Line d="M412,389 H466" strong />
        <Tag x={439} y={382} anchor="middle">{d.zeroQueries}</Tag>
        <Line d="M412,497 H466" />

        {/* reads, upward across the line */}
        <Line d="M150,364 V296" />
        <Tag x={158} y={346}>{d.indexedLookup}</Tag>
        <Line d="M398,443 H430 V296" />
        <Tag x={438} y={346}>{d.aggregates}</Tag>

        {/* the single write, on its own role */}
        <Line d="M42,543 H16 V296" dash="4 3" />
        <Tag x={24} y={306}>{d.writer}</Tag>

        {/* the tools reach the pool over HTTP, around the line rather than through it */}
        <Line d="M575,520 V540 H956 V152 H922" />
        <Tag x={790} y={533}>{d.nineGates}</Tag>

        {/* and the same pool is what verifies a seller */}
        <Line d="M918,156 H978 V576 H704" accent />
        <Tag x={948} y={306} anchor="end" accent>{d.ownership}</Tag>
    </svg>
);

/* ---- stacked layout, 380 x 1050 ----------------------------------------- */

const Stacked = ({ d }: { d: Labels }) => (
    <svg
        viewBox="0 0 380 1050"
        width={380}
        height={1050}
        role="img"
        aria-labelledby={`${TITLE_ID} ${DESC_ID}`}
        className="mx-auto block h-auto w-full font-serif"
        style={{ maxWidth: 430 }}
    >
        <title id={TITLE_ID}>{d.title}</title>
        <desc id={DESC_ID}>{d.desc}</desc>
        <Defs />

        <Band x={24} y={13}>{d.bandSources}</Band>
        <Box x={24} y={22} w={161} h={34} title="X" sub={d.xSub} titleSize={9} subSize={7} />
        <Box x={195} y={22} w={161} h={34} title="Telegram" sub={d.telegramSub} titleSize={9} subSize={7} />
        <Box x={24} y={62} w={161} h={34} title="Bluesky" sub={d.blueskySub} titleSize={9} subSize={7} />
        <Box x={195} y={62} w={161} h={34} title="TikTok" sub={d.tiktokSub} titleSize={9} subSize={7} />
        <Box x={24} y={102} w={161} h={34} title="YouTube" sub={d.youtubeSub} titleSize={9} subSize={7} />
        <Box x={195} y={102} w={161} h={34} title="LinkedIn" sub={d.linkedinSub} titleSize={9} subSize={7} />

        <path d="M30,136 V144" stroke={ACCENT} strokeWidth="1.4" fill="none" />
        <Tag x={36} y={152} accent size={7}>{d.sharedNote}</Tag>

        <Line d="M290,136 V172" />

        <Band x={24} y={168}>{d.bandEngine}</Band>
        <rect x={24} y={176} width={332} height={106} rx="2" fill={SUNK} stroke={INK} strokeWidth="1.4" />
        <Box x={36} y={184} w={150} h={40} title={d.crawlers} sub={d.crawlersSub} titleSize={9} subSize={6.8} />
        <Box x={194} y={184} w={150} h={40} title={d.discovery} sub={d.discoverySub} titleSize={9} subSize={6.8} />
        <Box x={36} y={232} w={150} h={40} title={d.rollups} sub={d.rollupsSub} titleSize={9} subSize={6.8} />
        <Box x={194} y={232} w={150} h={40} title="xlookup" sub={d.xlookupSub} titleSize={9} subSize={6.8} strong />

        <Line d="M190,282 V308" strong />
        <Tag x={198} y={300}>{d.write}</Tag>

        <Band x={24} y={304}>{d.bandDb}</Band>
        <rect x={24} y={312} width={332} height={170} rx="2" fill={PAPER} stroke={INK} strokeWidth="1.4" />
        <Box x={36} y={320} w={150} h={22} title="xdir_accounts 18.5M" titleSize={7.5} />
        <Box x={194} y={320} w={150} h={22} title="xedges 79.8M" titleSize={7.5} />
        <Box x={36} y={346} w={150} h={22} title="xdir_account_engagement" titleSize={7.5} />
        <Box x={194} y={346} w={150} h={22} title="xdir_viral_patterns" titleSize={7.5} />
        <Box x={36} y={372} w={150} h={22} title="xdir_research_findings" titleSize={7.5} />
        <Box x={194} y={372} w={150} h={22} title="scraper.x_tweets 90d" titleSize={7.5} />
        <Box x={36} y={398} w={150} h={22} title="bdir_accounts 3.8M" titleSize={7.5} />
        <Box x={194} y={398} w={150} h={22} title="tgdir_chats 3.0M" titleSize={7.5} />
        <Box x={36} y={424} w={150} h={22} title="ytdir_channels 35.1K" titleSize={7.5} />
        <Box x={194} y={424} w={150} h={22} title="ttdir_accounts 17.5K" titleSize={7.5} />
        <Box x={36} y={450} w={150} h={22} title="lidir_* LinkedIn" titleSize={7.5} />
        <Tag x={269} y={466} anchor="middle" size={6.8}>{d.countsNote}</Tag>

        <Boundary x1={20} x2={360} y={506} cx={190} bw={172} label={d.boundary} />

        <Band x={24} y={536}>{d.bandApp}</Band>
        <rect x={24} y={546} width={332} height={194} rx="2" fill={SUNK} stroke={INK} strokeWidth="1.4" />
        <Box x={36} y={556} w={308} h={40} title={d.rank} sub={d.rankSub} titleSize={9} subSize={7.2} />
        <Box x={36} y={602} w={308} h={40} title={d.insights} sub={d.insightsSub} titleSize={9} subSize={7.2} />
        <Box x={36} y={648} w={308} h={40} title={d.tools} sub={d.toolsSub} titleSize={9} subSize={7.2} />
        <Box x={36} y={694} w={308} h={34} title={d.admin} sub={d.adminSub} titleSize={9} subSize={7.2} />

        {/* reads and the single write, all leaving the app together */}
        <Line d="M80,544 V486" />
        <Tag x={84} y={524} size={7}>{d.lookupShort}</Tag>
        <Line d="M190,544 V486" />
        <Tag x={194} y={538} size={7}>{d.aggregatesShort}</Tag>
        <Line d="M300,544 V486" dash="4 3" />
        <Tag x={304} y={524} size={7}>{d.writerShort}</Tag>

        <Box x={24} y={776} w={161} h={46} title={d.baked} sub={d.bakedSub} titleSize={9} subSize={6.8} strong />
        <Box x={195} y={776} w={161} h={46} title="tool-guard" sub={d.guardSub} titleSize={9} subSize={6.8} />
        <Line d="M104,740 V774" strong />
        <Tag x={100} y={760} anchor="end" size={7}>{d.zeroQueries}</Tag>
        <Line d="M275,740 V774" />

        <Box x={24} y={856} w={200} h={44} title={d.seller} sub={d.sellerSub} accent titleSize={9} subSize={7} />

        <Box x={24} y={920} w={332} h={32} title="Caddy 2" sub={d.caddySub} titleSize={9} subSize={7.2} />
        <Box x={24} y={958} w={332} h={32} title="PostgREST 12.2.3" sub={d.postgrestSub} titleSize={9} subSize={7.2} />
        <Box x={24} y={996} w={332} h={32} title="Postgres 17" sub={d.marketSub} titleSize={9} subSize={7.2} />
        <Line d="M190,952 V956" />
        <Line d="M190,990 V994" />

        <Line d="M356,799 H368 V252 H346" />
        <Tag x={364} y={762} anchor="end" size={7}>{d.nineGates}</Tag>

        <Line d="M269,272 V292 H12 V878 H22" accent />
        <Tag x={20} y={846} accent size={7}>{d.ownership}</Tag>
    </svg>
);

/* ---- picker ------------------------------------------------------------- */

const QUERY = '(min-width: 1024px)';

const PlayerSellsDiagram = () => {
    const { lang } = useLanguage();
    const d = (lang === 'tr' ? playersellsTr : playersellsEn).diagram;

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

export default PlayerSellsDiagram;

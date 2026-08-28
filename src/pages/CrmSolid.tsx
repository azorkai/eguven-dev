import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import CrmSolidDiagram from '../components/CrmSolidDiagram';
import { useLanguage } from '../i18n/useLanguage';
import { rich } from '../i18n/rich';
import {
    CRM_IMAGES,
    CRM_LINKS,
    CRM_SECTION_IDS,
    CRM_SECTION_NUMBERS,
    type CrmSectionId,
} from '../content/crmsolid';
import { crmsolidEn } from '../content/crmsolid.en';
import { crmsolidTr } from '../content/crmsolid.tr';

/* ---------------------------------------------------------------------------
 *  CRMSOLID  ( /projects/crmsolid )
 *
 *  A case study set as a newspaper feature. Long, so it carries its own index:
 *  a sticky contents column on wide screens, a collapsible bar on narrow ones.
 *  Body copy stays on a single narrow measure. Printed columns work on paper
 *  because the eye can jump back up the page; on a screen it just makes the
 *  reader scroll twice.
 *
 *  Every number on this page is either counted from the repository or read out
 *  of production logs. The repository is private, so the page is the evidence.
 *
 *  The prose itself lives in src/content/crmsolid.{en,tr}.ts. This file is the
 *  layout; the title and description are set by <DocumentMeta>.
 * ------------------------------------------------------------------------- */

const ANCHOR = { scrollMarginTop: 'calc(var(--machine-bar-h, 0px) + 7rem)' };

/* ---- furniture ---------------------------------------------------------- */

function Section({
    id,
    title,
    children,
}: {
    id: CrmSectionId;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section id={id} style={ANCHOR} className="mb-20 md:mb-24">
            {/* One wrapper so the whole standing head spans both printed
                columns instead of the rule and the folio drifting apart. */}
            <div className="print-span">
                <div className="rule-thick mb-3" />
                <div className="mb-8 flex items-baseline gap-5">
                    <h2 className="font-headline text-[1.6rem] leading-tight font-bold text-ink md:text-[2.1rem]">
                        {title}
                    </h2>
                    <span className="folio ml-auto shrink-0">{CRM_SECTION_NUMBERS[id]}</span>
                </div>
            </div>
            {children}
        </section>
    );
}

function Sub({ children }: { children: React.ReactNode }) {
    return <h3 className="label mt-10 mb-3 first:mt-0">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
    return <p className="measure mb-5 text-base leading-[1.75] text-ink-body">{children}</p>;
}

function Figure({
    src,
    alt,
    caption,
    width,
    height,
    className = '',
    eager = false,
}: {
    src: string;
    alt: string;
    caption: string;
    width: number;
    height: number;
    className?: string;
    eager?: boolean;
}) {
    return (
        <figure className={`my-10 ${className}`}>
            <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                loading={eager ? 'eager' : 'lazy'}
                decoding="async"
                className="block h-auto w-full border border-rule bg-paper-raised"
            />
            <figcaption className="mt-3 border-t border-rule pt-2 text-[13px] leading-relaxed text-ink-muted">
                {caption}
            </figcaption>
        </figure>
    );
}

function Leader({ k, v }: { k: string; v: string }) {
    return (
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 py-2">
            <span className="shrink-0 text-[14px] text-ink-body">{k}</span>
            <span className="hidden min-w-6 flex-1 translate-y-[-0.25em] border-b border-dotted border-rule-strong sm:block" />
            <span className="font-mono text-[12.5px] font-bold text-ink tabular-nums">{v}</span>
        </div>
    );
}

function Bullets({ lines }: { lines: string[] }) {
    return (
        <ul className="measure mb-8 space-y-2.5">
            {lines.map((line, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-[1.7] text-ink-body">
                    <span aria-hidden="true" className="shrink-0 text-ink-faint select-none">
                        &bull;
                    </span>
                    <span>{rich(line)}</span>
                </li>
            ))}
        </ul>
    );
}

function TocList({
    titles,
    active,
    onPick,
}: {
    titles: Record<CrmSectionId, string>;
    active: CrmSectionId;
    onPick?: () => void;
}) {
    return (
        <ol className="space-y-0">
            {CRM_SECTION_IDS.map((id) => {
                const on = id === active;
                return (
                    <li key={id}>
                        <a
                            href={`#${id}`}
                            onClick={onPick}
                            aria-current={on ? 'true' : undefined}
                            className={`flex min-h-11 items-baseline gap-3 border-l-2 py-2.5 pl-3 text-[13px] leading-snug transition-colors xl:min-h-0 xl:py-1.5 ${
                                on
                                    ? 'border-l-ink font-semibold text-ink'
                                    : 'border-l-rule text-ink-muted hover:border-l-rule-strong hover:text-ink'
                            }`}
                        >
                            <span className="folio shrink-0 pt-[3px] tabular-nums">
                                {CRM_SECTION_NUMBERS[id]}
                            </span>
                            <span>{titles[id]}</span>
                        </a>
                    </li>
                );
            })}
        </ol>
    );
}

/* ---- page --------------------------------------------------------------- */

const CrmSolid: React.FC = () => {
    const { lang } = useLanguage();
    const c = lang === 'tr' ? crmsolidTr : crmsolidEn;

    const [active, setActive] = useState<CrmSectionId>(CRM_SECTION_IDS[0]);
    const [tocOpen, setTocOpen] = useState(false);

    /* Which section the reader is in. Read on scroll, throttled to one frame:
       the last heading that has passed the top of the viewport wins. */
    useEffect(() => {
        let frame = 0;
        const read = () => {
            frame = 0;
            let current: CrmSectionId = CRM_SECTION_IDS[0];
            for (const id of CRM_SECTION_IDS) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= 180) current = id;
            }
            setActive(current);
        };
        const onScroll = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(read);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <div className="w-full">
            {/* ---- masthead ---- */}
            <header className="container mx-auto px-6 pt-32 pb-12 md:px-10 md:pt-28 lg:px-16">
                <div className="mb-6 flex flex-wrap items-center gap-4">
                    <span className="kicker">{c.kicker}</span>
                    <span className="folio">{c.byline}</span>
                </div>

                {/* lang="en" so CSS uppercasing does not put a Turkish dot on the
                    product name: CRMSOLID, never CRMSOLID with a dotted I. */}
                <h1 lang="en" className="masthead mb-8 uppercase select-none">
                    CRM<span className="headline-accent">Solid</span>
                </h1>

                <div className="rule-double mb-8 max-w-4xl" />

                <p className="standfirst measure mb-5">{rich(c.standfirst)}</p>
                <p className="measure text-[15px] leading-[1.75] text-ink-body">{rich(c.intro)}</p>
            </header>

            {/* ---- by the numbers ---- */}
            <div className="container mx-auto px-6 pb-16 md:px-10 lg:px-16">
                <div className="border-y-2 border-ink">
                    <dl className="grid grid-cols-2 gap-px bg-rule sm:grid-cols-3 lg:grid-cols-6">
                        {c.stats.map(([value, label]) => (
                            <div key={label} className="bg-paper-raised px-4 py-5">
                                <dt className="font-headline text-2xl leading-none font-bold text-ink tabular-nums">
                                    {value}
                                </dt>
                                <dd className="folio mt-2 leading-snug normal-case tracking-[0.08em]">
                                    {label}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
                <p className="folio mt-3 normal-case tracking-[0.08em]">{c.statsNote}</p>
            </div>

            {/* ---- body ---- */}
            <main className="container mx-auto px-6 pb-32 md:px-10 lg:px-16">
                <div className="xl:grid xl:grid-cols-[14rem_minmax(0,1fr)] xl:gap-14">
                    {/* desktop contents */}
                    <aside data-print="hide" className="hidden xl:block">
                        <nav
                            aria-label={c.contentsAria}
                            className="sticky"
                            style={{ top: 'calc(var(--machine-bar-h, 0px) + 7.5rem)' }}
                        >
                            <p className="label mb-4 border-b border-rule pb-2">{c.contents}</p>
                            <TocList titles={c.toc} active={active} />
                        </nav>
                    </aside>

                    <div>
                        {/* mobile contents */}
                        <details
                            open={tocOpen}
                            onToggle={(e) => setTocOpen((e.currentTarget as HTMLDetailsElement).open)}
                            data-print="hide"
                            className="paper-panel sticky z-30 mb-14 border-t-2 border-t-ink xl:hidden"
                            style={{ top: 'calc(var(--machine-bar-h, 0px) + 4.75rem)' }}
                        >
                            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 marker:content-['']">
                                <span className="label shrink-0">{c.contents}</span>
                                <span className="folio truncate normal-case tracking-[0.08em]">
                                    {CRM_SECTION_NUMBERS[active]} {c.toc[active]}
                                </span>
                                <span aria-hidden="true" className="ml-auto shrink-0 text-ink-muted">
                                    {tocOpen ? <Minus size={15} /> : <Plus size={15} />}
                                </span>
                            </summary>
                            <nav
                                aria-label={c.contentsAria}
                                className="border-t border-rule px-2 py-3"
                                onClick={() => setTocOpen(false)}
                            >
                                <TocList titles={c.toc} active={active} onPick={() => setTocOpen(false)} />
                            </nav>
                        </details>

                        <article className="print-columns">
                            {/* -------------------------------------------------- 01 */}
                            <Section id="problem" title={c.heading.problem}>
                                {c.problem.intro.map((para, i) => (
                                    <P key={i}>{rich(para)}</P>
                                ))}

                                {c.problem.subs.map((s) => (
                                    <div key={s.head}>
                                        <Sub>{s.head}</Sub>
                                        <P>{rich(s.body)}</P>
                                    </div>
                                ))}

                                <Figure
                                    src={CRM_IMAGES.inbox.src}
                                    width={CRM_IMAGES.inbox.width}
                                    height={CRM_IMAGES.inbox.height}
                                    alt={c.problem.figure.alt}
                                    caption={c.problem.figure.caption}
                                    eager
                                />
                            </Section>

                            {/* -------------------------------------------------- 02 */}
                            <Section id="architecture" title={c.heading.architecture}>
                                <P>{rich(c.architecture.intro)}</P>

                                <dl className="mb-10 divide-y divide-rule border-y border-rule">
                                    {c.architecture.pieces.map((p) => (
                                        <div key={p.name} className="py-4">
                                            <dt className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                                <span className="font-headline text-lg font-bold text-ink">
                                                    {p.name}
                                                </span>
                                                <span className="font-mono text-[11px] tracking-[0.06em] text-ink-faint">
                                                    {p.tech}
                                                </span>
                                            </dt>
                                            <dd className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-ink-body">
                                                {rich(p.why)}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>

                                <Sub>{c.architecture.whyNotHead}</Sub>
                                {c.architecture.whyNot.map((para, i) => (
                                    <P key={i}>{rich(para)}</P>
                                ))}

                                <Sub>{c.architecture.runtimeHead}</Sub>
                                <Bullets lines={c.architecture.runtime} />

                                <figure className="my-12">
                                    <div className="paper-panel p-4 md:p-6">
                                        <CrmSolidDiagram />
                                    </div>
                                    <figcaption className="mt-3 border-t border-rule pt-2 text-[13px] leading-relaxed text-ink-muted">
                                        {c.architecture.diagramCaption}
                                    </figcaption>
                                </figure>

                                <Figure
                                    src={CRM_IMAGES.pipeline.src}
                                    width={CRM_IMAGES.pipeline.width}
                                    height={CRM_IMAGES.pipeline.height}
                                    alt={c.architecture.figure.alt}
                                    caption={c.architecture.figure.caption}
                                />
                            </Section>

                            {/* -------------------------------------------------- 03 */}
                            <Section id="catalogue" title={c.heading.catalogue}>
                                {c.catalogue.subs.map((s) => (
                                    <div key={s.head}>
                                        <Sub>{s.head}</Sub>
                                        <P>{rich(s.body)}</P>
                                    </div>
                                ))}
                            </Section>

                            {/* -------------------------------------------------- 04 */}
                            <Section id="mcp" title={c.heading.mcp}>
                                <P>{rich(c.mcp.intro)}</P>

                                <dl className="measure mb-8 divide-y divide-rule border-y border-rule">
                                    {c.mcp.facts.map((f) => (
                                        <div key={f.k} className="py-3">
                                            <dt className="font-headline text-base font-bold text-ink">{f.k}</dt>
                                            <dd className="mt-1 text-[14px] leading-relaxed text-ink-body">
                                                {f.v}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>

                                {c.mcp.subs.map((s) => (
                                    <div key={s.head}>
                                        <Sub>{s.head}</Sub>
                                        <P>{rich(s.body)}</P>
                                    </div>
                                ))}

                                <Figure
                                    src={CRM_IMAGES.mcp.src}
                                    width={CRM_IMAGES.mcp.width}
                                    height={CRM_IMAGES.mcp.height}
                                    alt={c.mcp.figure.alt}
                                    caption={c.mcp.figure.caption}
                                    className="max-w-2xl"
                                />
                            </Section>

                            {/* -------------------------------------------------- 05 */}
                            <Section id="tenancy" title={c.heading.tenancy}>
                                {c.tenancy.paras.map((para, i) => (
                                    <P key={i}>{rich(para)}</P>
                                ))}
                            </Section>

                            {/* -------------------------------------------------- 06 */}
                            <Section id="flood" title={c.heading.flood}>
                                {c.flood.paras.map((para, i) => (
                                    <P key={i}>{rich(para)}</P>
                                ))}
                            </Section>

                            {/* -------------------------------------------------- 07 */}
                            <Section id="realtime" title={c.heading.realtime}>
                                {c.realtime.subs.map((s) => (
                                    <div key={s.head}>
                                        <Sub>{s.head}</Sub>
                                        {s.paras.map((para, i) => (
                                            <P key={i}>{rich(para)}</P>
                                        ))}
                                    </div>
                                ))}

                                <Figure
                                    src={CRM_IMAGES.agents.src}
                                    width={CRM_IMAGES.agents.width}
                                    height={CRM_IMAGES.agents.height}
                                    alt={c.realtime.figure.alt}
                                    caption={c.realtime.figure.caption}
                                />
                            </Section>

                            {/* -------------------------------------------------- 08 */}
                            <Section id="operations" title={c.heading.operations}>
                                {c.operations.subs.map((s) => (
                                    <div key={s.head}>
                                        <Sub>{s.head}</Sub>
                                        <P>{rich(s.body)}</P>
                                    </div>
                                ))}
                            </Section>

                            {/* -------------------------------------------------- 09 */}
                            <Section id="failures" title={c.heading.failures}>
                                <P>{rich(c.failures.intro)}</P>

                                <div className="paper-panel mt-8 border-t-2 border-t-ink">
                                    <p className="folio border-b border-rule px-5 py-3 normal-case tracking-[0.1em] sm:px-7">
                                        {c.failures.panelHead}
                                    </p>
                                    <ol className="divide-y divide-rule">
                                        {c.failures.items.map((f, i) => (
                                            <li key={f.lead} className="flex gap-4 px-5 py-5 sm:gap-6 sm:px-7">
                                                <span
                                                    aria-hidden="true"
                                                    className="shrink-0 pt-[3px] font-mono text-[12px] font-bold text-ink-faint tabular-nums"
                                                >
                                                    {String(i + 1).padStart(2, '0')}
                                                </span>
                                                <div className="max-w-xl">
                                                    <p className="mb-1 font-headline text-[16px] font-bold text-ink">
                                                        {f.lead}
                                                    </p>
                                                    <p className="text-[14px] leading-[1.7] text-ink-body">
                                                        {rich(f.body)}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </div>

                                <p className="measure mt-8 text-[15px] leading-[1.75] text-ink-body md:text-base">
                                    {rich(c.failures.closing)}
                                </p>
                            </Section>

                            {/* -------------------------------------------------- 10 */}
                            <Section id="stack" title={c.heading.stack}>
                                <P>{rich(c.stack.intro)}</P>
                                <dl className="divide-y divide-rule border-y border-rule">
                                    {c.stack.rows.map(([k, v]) => (
                                        <div key={k} className="py-4 md:grid md:grid-cols-[10rem_1fr] md:gap-6">
                                            <dt className="folio mb-1.5 pt-1 leading-snug md:mb-0">{k}</dt>
                                            <dd className="max-w-2xl text-[14px] leading-relaxed text-ink-body">
                                                {v}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </Section>

                            {/* -------------------------------------------------- 11 */}
                            <Section id="numbers" title={c.heading.numbers}>
                                <P>{rich(c.numbers.intro)}</P>
                                <div className="max-w-2xl divide-y divide-rule border-y border-rule">
                                    {c.numbers.rows.map(([k, v]) => (
                                        <Leader key={k} k={k} v={v} />
                                    ))}
                                </div>
                            </Section>

                            {/* -------------------------------------------------- 12 */}
                            <Section id="links" title={c.heading.links}>
                                <P>{rich(c.links.intro)}</P>

                                <ul className="mb-4 divide-y divide-rule border-y border-rule">
                                    {CRM_LINKS.map((link) => (
                                        <li key={link.href} className="py-4">
                                            <a
                                                href={link.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                data-print-url="off"
                                                className="inline-flex min-h-11 items-center font-headline text-lg font-bold text-ink underline decoration-rule-strong underline-offset-4 transition-colors hover:text-accent xl:min-h-0"
                                            >
                                                {link.name}
                                            </a>
                                            <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-ink-body">
                                                {c.links.notes[link.key]}
                                            </p>
                                            <p className="folio mt-1.5 break-all normal-case tracking-[0.04em]">
                                                {link.href}
                                            </p>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-12 border-t-2 border-ink pt-8">
                                    <p className="measure mb-8 text-[15px] leading-[1.75] text-ink-body">
                                        {c.links.disclaimer}
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <Link
                                            to="/"
                                            className="inline-flex items-center gap-3 border border-ink px-8 py-4 text-[11px] font-bold tracking-[0.2em] text-ink uppercase transition-colors hover:bg-ink hover:text-paper-raised"
                                        >
                                            <span aria-hidden="true">&larr;</span> {c.links.allProjects}
                                        </Link>
                                        <a
                                            href="https://crmsolid.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-3 border border-rule-strong px-8 py-4 text-[11px] font-bold tracking-[0.2em] text-ink-muted uppercase transition-colors hover:border-ink hover:text-ink"
                                        >
                                            {c.links.visitSite}
                                        </a>
                                    </div>
                                </div>
                            </Section>
                        </article>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CrmSolid;

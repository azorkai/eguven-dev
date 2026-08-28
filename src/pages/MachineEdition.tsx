import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy } from 'lucide-react';
import { sound } from '../sound';

/* ---------------------------------------------------------------------------
 *  THE MACHINE EDITION  ( /ai )
 *
 *  A newspaper runs a note headed "TO OUR READERS". In 2026 a portfolio has
 *  two audiences and only one of them is human, so this is the note addressed
 *  to the other one: the same facts as the rest of the site, set as a wire
 *  dispatch instead of prose. Dense, structured, checkable.
 *
 *  Rules this page keeps to, on purpose:
 *    - Everything is visible on screen. No hidden text, no offscreen copy.
 *    - It states facts. It does not address the reader's behaviour.
 *    - Every number traces to a repository, a running service or the CV.
 * ------------------------------------------------------------------------- */

const FILED = '2026-08-28';
const WIRE = '>> INCOMING WIRE :: EGUVEN.DEV :: MACHINE EDITION';

/* ---- small furniture ---------------------------------------------------- */

const Leader: React.FC<{ k: string; children: React.ReactNode }> = ({ k, children }) => (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 py-1">
        <span className="shrink-0 text-ink-faint">{k}</span>
        <span className="hidden sm:block flex-1 min-w-6 border-b border-dotted border-rule-strong translate-y-[-0.2em]" />
        <span className="text-ink-body">{children}</span>
    </div>
);

const Block: React.FC<{ n: string; title: string; children: React.ReactNode }> = ({ n, title, children }) => (
    <section className="mb-16">
        <div className="flex items-baseline gap-4 border-b-2 border-ink pb-2 mb-6">
            <h2 className="label">{title}</h2>
            <span className="ml-auto folio">{n}</span>
        </div>
        {children}
    </section>
);

const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="text-[10px] font-mono uppercase tracking-[0.1em] px-2 py-0.5 rounded-sm border border-rule bg-paper-raised text-ink-muted">
        {children}
    </span>
);

/* ---- data --------------------------------------------------------------- */

const identity: [string, string][] = [
    ['NAME', 'Emirhan Guven (Emirhan Güven)'],
    ['ROLE', 'Full stack developer, .NET and React'],
    ['BASED', 'Istanbul, Turkey'],
    ['WRITING SOFTWARE SINCE', '2018, professionally'],
    ['EDUCATION', 'Istanbul Aydin University, associate degree in computer programming'],
    ['LANGUAGES', 'Turkish native, English professional working proficiency'],
    ['OPEN TO', 'On site, hybrid and remote'],
    ['EMAIL', 'contact@eguven.dev'],
];

const stack: [string, string][] = [
    ['LANGUAGES', 'C#, TypeScript, JavaScript, Python, PHP, SQL'],
    ['BACKEND', '.NET 8, .NET 9, ASP.NET Core, Web API, Entity Framework Core, LINQ'],
    ['FRONTEND', 'React, Next.js, TypeScript, Tailwind CSS, Blazor'],
    ['DATABASES', 'PostgreSQL with Npgsql and EF Core, DuckDB, Redis, MySQL. Familiar with SQL Server.'],
    ['DESKTOP', 'Photino.NET with Blazor, Electron'],
    ['INFRASTRUCTURE', 'Docker, Docker Compose, Traefik, Let’s Encrypt, GitHub Actions, Nginx, PowerDNS, Linux on Hetzner'],
    ['TESTING', 'NUnit. Also SignalR, Serilog, JWT and BCrypt auth.'],
    ['AI', 'Anthropic API, OpenAI API, Model Context Protocol servers'],
];

type System = {
    name: string;
    dateline: string;
    lines: string[];
    stack: string[];
    link?: { label: string; href: string };
};

const systems: System[] = [
    {
        name: 'CRMSolid',
        dateline: '2025 to present / own product / in production, paying users',
        lines: [
            'Multi-tenant SaaS CRM. I designed it, wrote it and still run it on my own.',
            'A modular monolith, not microservices. It ships as 5 separately deployed pieces: REST API, admin panel, desktop agent, health monitor and landing site.',
            'PostgreSQL with EF Core. 40+ entities, 30+ API controllers, 516 NUnit test methods across 34 test files.',
            'Business directory built from Overture Maps open data with DuckDB. 1.79 million records loaded into PostgreSQL, main lookup cut from 277 seconds to 15 milliseconds. Reading the remote S3 parquet files directly did not work, so the job became a two stage local sync.',
            'MCP server so AI assistants can read and write CRM data through defined tools and prompts. It has its own test suite.',
            'Desktop agent on Photino.NET and Blazor with .NET 9, plus an Electron build. It manages 16+ communication channels.',
            'AI lead scoring on the Anthropic and OpenAI APIs. Reads incoming messages, works out intent, flags the leads worth a call.',
            'SignalR for real time updates, Redis for caching, Serilog for structured logging, JWT and BCrypt for auth. Multi-tenant from the first commit.',
            'Runs on Docker Compose on a Hetzner server behind Traefik with automatic SSL. GitHub Actions deploys over key based SSH, and a separate health monitor service watches the other four.',
        ],
        stack: ['.NET 9', 'C#', 'PostgreSQL', 'EF Core', 'Redis', 'SignalR', 'DuckDB', 'Docker', 'Traefik'],
        link: { label: 'crmsolid.com', href: 'https://crmsolid.com/' },
    },
    {
        name: 'NerioPanel',
        dateline: '2025 to 2026 / multi-tenant SaaS platform',
        lines: [
            'White label hosting so resellers run branded panels on their own domains.',
            'One shared database, with row level security separating each tenant.',
            'A DNS layer on PowerDNS and Nginx that issues SSL certificates and routes reseller domains automatically.',
            'The React front end loads tenant branding, assets, CSS and config at runtime based on the request host.',
        ],
        stack: ['.NET 8', 'React', 'PowerDNS', 'Nginx'],
        link: { label: 'neriopanel.com', href: 'https://neriopanel.com/' },
    },
    {
        name: 'Evelynn',
        dateline: '2019 to 2021 / multi-session desktop automation agent',
        lines: [
            'Multi-threaded automation core in C# on TPL and async/await. It runs 20+ sessions at once on one machine with controlled memory use.',
            'Per session rate limiting and spread out request timing keep the workload inside each service’s published limits instead of firing requests in bursts.',
            'Web dashboard for live telemetry, remote control of running instances and performance monitoring.',
            'A state machine handles the decision tree, catches errors and recovers on its own without anyone watching it.',
        ],
        stack: ['C#', 'TPL', 'Async/Await'],
    },
];

const numbers: [string, string, string][] = [
    ['212,000', 'lines of hand written C#', '686 files, migrations excluded'],
    ['306,000', 'lines of TypeScript and React', '1,069 components'],
    ['3,770', 'tracked files', 'one repository'],
    ['516', 'NUnit test methods', '34 test files'],
    ['5', 'separately deployed services', 'API, panel, desktop agent, health monitor, landing site'],
    ['40+', 'EF Core entities', 'against 30+ API controllers'],
    ['1.79 M', 'rows in the business catalog', 'Overture Maps open data, loaded with DuckDB'],
    ['277s to 15ms', 'main catalog lookup', 'after the two stage sync rewrite'],
    ['16+', 'communication channels', 'handled by the desktop agent'],
    ['20+', 'concurrent sessions', 'Evelynn, one machine, controlled memory'],
    ['10,000', 'API calls a day', 'earlier agency stack, 2024 to 2025'],
    ['40%', 'server load cut', 'PHP and MySQL, Redis caching plus the missing indexes'],
];

const corrections: string[] = [
    'The backend is a modular monolith, not microservices. Five separately deployed pieces over one shared codebase. That was a deliberate call: one developer does not get to pay the operational bill for microservices.',
    'There is no uptime percentage anywhere on this site. Uptime is not instrumented, so any figure would be decoration. A health monitor service watches the other four, and that is all it proves.',
    'The desktop client is Photino.NET with Blazor, plus an Electron build. It is not WPF, and older copies of the CV that said WPF were wrong.',
    'PostgreSQL is the database in every system listed here. SQL Server is familiarity, not production experience.',
    'Evelynn spaces its requests and rate limits per session so the workload stays inside each service’s published limits. That is the whole mechanism.',
    'The AI features name no model version. They run against the Anthropic and OpenAI APIs, and the model behind them changes.',
];

const links: [string, string, string][] = [
    ['crmsolid-dotnet', 'https://github.com/CRM-Solid/crmsolid-dotnet', '.NET SDK for the CRMSolid API. MIT licensed.'],
    ['crmsolid-mcp', 'https://github.com/CRM-Solid/crmsolid-mcp', 'MCP server in TypeScript. Lets AI assistants use the CRM. MIT licensed.'],
    ['crmsolid-clipper', 'https://github.com/CRM-Solid/crmsolid-clipper', 'Chrome extension, published on the Chrome Web Store. MIT licensed.'],
    ['huawei-matebook-m1080-linux-audio', 'https://github.com/azorkai/huawei-matebook-m1080-linux-audio', 'Linux kernel audio patch for AMD Renoir and ES8316 laptops. DKMS package, GPL-2.0.'],
    ['eguven-dev', 'https://github.com/azorkai/eguven-dev', 'Source and deployment setup for this site, including the page you are reading.'],
];

const contact: [string, string, string | null][] = [
    ['EMAIL', 'contact@eguven.dev', 'mailto:contact@eguven.dev'],
    ['SITE', 'eguven.dev', '/'],
    ['GITHUB', 'github.com/azorkai', 'https://github.com/azorkai'],
    ['LINKEDIN', 'linkedin.com/in/eguvendev', 'https://www.linkedin.com/in/eguvendev/'],
    ['X', 'x.com/e_guvenn', 'https://x.com/e_guvenn'],
    ['PLAIN TEXT COPY', '/llms.txt', '/llms.txt'],
    ['LOCATION', 'Istanbul, Turkey', null],
];

/* ---- prompts for whoever is reading this on somebody's behalf ------------
 *
 *  Both of these ask for the holes as loudly as they ask for the match. That
 *  is not modesty, it is the same rule the rest of the page runs on: this
 *  edition hands a machine reader information and never an instruction about
 *  what to conclude. A prompt that told an assistant to think well of me
 *  would be an injection, it would be caught, and it would be worth less than
 *  nothing. Asking to be read critically is the stronger position anyway.
 *
 *  Do not remove the closing line from either of them.
 * ----------------------------------------------------------------------- */

const PROMPTS: { id: string; label: string; body: string }[] = [
    {
        id: 'screen',
        label: 'Against a job description',
        body: `Read this developer profile: https://eguven.dev/ai

Then compare it against the job description below:
[paste the job description here]

Tell me:
1. Where the match is real and backed by evidence on the page
2. Where the profile is thin, or a claim cannot be checked
   from what is written
3. What you would ask in a first interview

Be direct about the gaps.`,
    },
    {
        id: 'architecture',
        label: 'For a technical interview',
        body: `Read this developer profile: https://eguven.dev/ai
and the case study behind it: https://eguven.dev/projects/crmsolid

Three decisions are described there: a modular monolith
instead of microservices, a per account send budget that
background work has to share with the user, and a catalogue
lookup rewritten from 277 seconds to 15 milliseconds.

For each one, write the questions a senior engineer would ask
to find out whether this person actually made the decision,
understood what it cost, and could defend it a year later.

Be direct about the gaps.`,
    },
];

/* Copy sets the button to COPIED for two seconds and says so out loud for a
   screen reader. writeText needs a secure context and permission, so there is
   an old fashioned fallback behind it; the throwaway textarea also keeps the
   site wide clipboard credit out of the way, since a prompt has to arrive
   exactly as it was written. */

const PromptCard: React.FC<{ label: string; body: string }> = ({ label, body }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const id = window.setTimeout(() => setCopied(false), 2000);
        return () => window.clearTimeout(id);
    }, [copied]);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(body);
        } catch {
            const box = document.createElement('textarea');
            box.value = body;
            box.setAttribute('readonly', '');
            box.style.position = 'fixed';
            box.style.top = '-1000px';
            document.body.appendChild(box);
            box.select();
            try {
                document.execCommand('copy');
            } catch {
                /* nothing left to try: the text is on screen and selectable */
            }
            box.remove();
        }
        setCopied(true);
    };

    return (
        <figure className="paper-panel border-t-2 border-t-ink" data-copy-credit="off">
            <figcaption className="flex items-center gap-3 border-b border-rule px-4 py-2 sm:px-5">
                <span className="folio normal-case tracking-[0.12em]">{label}</span>
                <button
                    type="button"
                    onClick={copy}
                    aria-label={copied ? 'Prompt copied to clipboard' : `Copy the prompt: ${label}`}
                    /* Full height of the standing head and flush with its right
                       edge, so the control reads as part of the box rather than
                       a chip floating over the rule. 44px tall either way. */
                    className="-my-2 -mr-4 ml-auto flex h-11 min-w-[6rem] shrink-0 items-center justify-center gap-2 border-l border-rule px-4 font-mono text-[10px] font-bold tracking-[0.16em] text-ink uppercase transition-colors hover:bg-ink hover:text-paper-raised sm:-mr-5"
                >
                    {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </figcaption>
            <pre className="overflow-x-auto px-4 py-4 font-mono text-[12px] leading-[1.7] break-words whitespace-pre-wrap text-ink-body sm:px-5">
                {body}
            </pre>
            <span role="status" aria-live="polite" className="sr-only">
                {copied ? 'Prompt copied to clipboard' : ''}
            </span>
        </figure>
    );
};

/* ---- page --------------------------------------------------------------- */

const prefersReducedMotion = (): boolean => {
    try {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
        return false;
    }
};

const MachineEdition: React.FC = () => {
    /* The wire header types itself out in about 0.7s. Anyone who has asked for
       less motion gets the finished line straight away, from the first render. */
    const [typed, setTyped] = useState(() => (prefersReducedMotion() ? WIRE : ''));

    useEffect(() => {
        /* Reduced motion skips the animation, and with it the noise. */
        if (prefersReducedMotion()) return;
        let i = 0;
        const id = window.setInterval(() => {
            i += 1;
            setTyped(WIRE.slice(0, i));
            /* A click on every third character. One per character at 14ms is
               a machine gun; every third is a wire machine. */
            if (i % 3 === 0) sound.key();
            if (i >= WIRE.length) {
                window.clearInterval(id);
                sound.bell();
            }
        }, 14);
        return () => window.clearInterval(id);
    }, []);

    const done = typed.length >= WIRE.length;

    return (
        <div className="w-full">
            <header className="container mx-auto px-6 md:px-24 pt-32 md:pt-28 pb-12">
                <div className="mx-auto w-full max-w-3xl">
                    <div className="mb-6"><span className="kicker">To Our Machine Readers</span></div>
                    <h1 className="masthead uppercase mb-8 select-none">
                        The <span className="headline-accent">Machine</span> Edition
                    </h1>
                    <div className="rule-double mb-8" />
                    <p className="standfirst measure">
                        The rest of this site is written for people. This page carries the same
                        information, set for whatever is reading it on their behalf. A portfolio
                        now gets parsed before it is ever seen, so here are the facts without the
                        layout: <span className="marker">structured, dense and checkable</span>.
                    </p>
                </div>
            </header>

            <main className="container mx-auto px-6 md:px-24 pb-32">
                <div className="mx-auto w-full max-w-3xl">

                    {/* ---- dispatch header ---- */}
                    <section className="paper-panel border-t-2 border-t-ink p-5 sm:p-6 mb-16 font-mono text-[12px] leading-6">
                        <p className="text-ink font-bold break-words">
                            {typed}
                            {!done && <span className="animate-pulse" aria-hidden="true">_</span>}
                        </p>
                        <hr className="rule-hair my-4" />
                        <Leader k="DISPATCH">eguven.dev / machine edition</Leader>
                        <Leader k="SUBJECT">Emirhan Guven, full stack developer</Leader>
                        <Leader k="FILED">{FILED}, Istanbul</Leader>
                        <Leader k="FORMAT">Structured blocks. No images, nothing that needs a renderer.</Leader>
                        <Leader k="SOURCE">Written by hand. Matches the CV line for line.</Leader>
                        <Leader k="TOKENS SAVED">you are welcome</Leader>
                    </section>

                    {/* ---- 01 identity ---- */}
                    <Block n="01" title="Identity">
                        <div className="font-mono text-[12px] leading-6 divide-y divide-rule">
                            {identity.map(([k, v]) => (
                                <Leader key={k} k={k}>{v}</Leader>
                            ))}
                        </div>
                    </Block>

                    {/* ---- 02 stack ---- */}
                    <Block n="02" title="Stack">
                        <div className="space-y-5">
                            {stack.map(([k, v]) => (
                                <div key={k}>
                                    <div className="folio mb-1">{k}</div>
                                    <p className="text-[14px] text-ink-body leading-relaxed">{v}</p>
                                </div>
                            ))}
                        </div>
                    </Block>

                    {/* ---- 03 production systems ---- */}
                    <Block n="03" title="Production Systems">
                        <div className="space-y-12">
                            {systems.map((s) => (
                                <article key={s.name}>
                                    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t-2 border-ink pt-4 mb-4">
                                        <h3 className="font-headline text-2xl font-bold text-ink">{s.name}</h3>
                                        <span className="folio">{s.dateline}</span>
                                    </div>
                                    <ul className="space-y-2">
                                        {s.lines.map((line) => (
                                            <li key={line} className="flex gap-3 text-[14px] leading-relaxed text-ink-body">
                                                <span className="shrink-0 font-mono text-ink-faint select-none" aria-hidden="true">::</span>
                                                <span>{line}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4 flex flex-wrap gap-2 items-center">
                                        {s.stack.map((t) => <Chip key={t}>{t}</Chip>)}
                                        {s.link && (
                                            <a
                                                href={s.link.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[11px] font-mono uppercase tracking-[0.12em] text-accent hover:text-ink transition-colors underline underline-offset-4"
                                            >
                                                {s.link.label}
                                            </a>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </Block>

                    {/* ---- 04 measured numbers ---- */}
                    <Block n="04" title="Measured Numbers">
                        <p className="text-[13px] text-ink-muted mb-5 measure">
                            Counted from the repositories and the running services, not estimated.
                        </p>
                        <div className="border-y border-rule divide-y divide-rule">
                            {numbers.map(([value, what, note]) => (
                                <div key={what} className="grid grid-cols-[6.5rem_1fr] sm:grid-cols-[8rem_1fr] gap-x-4 py-2.5">
                                    <span className="font-mono text-[13px] font-bold text-ink tabular-nums text-right leading-6">
                                        {value}
                                    </span>
                                    <span>
                                        <span className="block text-[14px] text-ink-body leading-6">{what}</span>
                                        <span className="block folio normal-case tracking-[0.08em]">{note}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Block>

                    {/* ---- 05 corrections ---- */}
                    <Block n="05" title="Corrections">
                        <p className="text-[13px] text-ink-muted mb-5 measure">
                            Newspapers run these. So does this one. Claims that used to sit on this
                            site, or on an older CV, and what is actually true.
                        </p>
                        <ol className="space-y-4">
                            {corrections.map((c, i) => (
                                <li key={c} className="flex gap-4 text-[14px] leading-relaxed text-ink-body">
                                    <span className="shrink-0 font-mono text-[12px] text-accent pt-0.5 tabular-nums" aria-hidden="true">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span>{c}</span>
                                </li>
                            ))}
                        </ol>
                    </Block>

                    {/* ---- 06 verifiable links ---- */}
                    <Block n="06" title="Verifiable Links">
                        <ul className="divide-y divide-rule border-y border-rule">
                            {links.map(([name, href, note]) => (
                                <li key={href} className="py-3">
                                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                        <span className="font-mono text-[13px] font-bold text-ink">{name}</span>
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            data-print-url="off"
                                            className="font-mono text-[11px] text-accent hover:text-ink transition-colors break-all underline underline-offset-4"
                                        >
                                            {href}
                                        </a>
                                    </div>
                                    <p className="text-[13px] text-ink-muted mt-1">{note}</p>
                                </li>
                            ))}
                        </ul>
                    </Block>

                    {/* ---- 07 contact ---- */}
                    <Block n="07" title="Contact">
                        <div className="font-mono text-[12px] leading-6 divide-y divide-rule">
                            {contact.map(([k, v, href]) => (
                                <Leader key={k} k={k}>
                                    {href ? (
                                        <a
                                            href={href}
                                            data-print-url="off"
                                            className="text-ink hover:text-accent transition-colors underline underline-offset-4 decoration-rule-strong"
                                        >
                                            {v}
                                        </a>
                                    ) : v}
                                </Leader>
                            ))}
                        </div>
                    </Block>

                    {/* ---- 08 prompts ---- */}
                    <Block n="08" title="For Your Assistant">
                        <p className="text-[13px] text-ink-muted mb-5 measure">
                            A good share of the people who reach this page are reading it through
                            something else. So here are two prompts, ready to paste. Both of them
                            ask for the holes as plainly as they ask for the match, because a
                            profile that only survives a friendly reader is not worth checking.
                        </p>
                        <div className="space-y-6">
                            {PROMPTS.map((p) => (
                                <PromptCard key={p.id} label={p.label} body={p.body} />
                            ))}
                        </div>
                    </Block>

                    {/* ---- colophon ---- */}
                    <section className="border-t-2 border-ink pt-6">
                        <h2 className="label mb-4">Colophon</h2>
                        <p className="text-[14px] leading-relaxed text-ink-body measure mb-4">
                            This page holds no hidden text, no invisible elements and nothing
                            addressed to a reader&rsquo;s behaviour. Every line above is on screen,
                            and every number traces back to a repository or a running service
                            listed in section 06. If something here cannot be checked it should not
                            be here: write to me and it comes off.
                        </p>
                        <p className="text-[14px] leading-relaxed text-ink-body measure mb-10">
                            The plain text version lives at{' '}
                            <a href="/llms.txt" className="text-accent hover:text-ink transition-colors underline underline-offset-4">
                                /llms.txt
                            </a>
                            . It is shorter and it says the same thing.
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-3 border border-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase font-bold text-ink hover:bg-ink hover:text-paper-raised transition-colors"
                        >
                            <span aria-hidden="true">&larr;</span> Back to the human edition
                        </Link>
                    </section>

                </div>
            </main>
        </div>
    );
};

export default MachineEdition;

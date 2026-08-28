import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/useLanguage';

/* ---------------------------------------------------------------------------
 *  404.
 *
 *  A newspaper does not tell you the page is missing; the archive desk tells
 *  you that nothing was ever filed under that address. Same furniture as the
 *  rest of the paper - kicker, nameplate, double rule, standfirst - then the
 *  slip that says what was asked for, and the list of what is still on the
 *  stand so nobody is left in a dead end.
 *
 *  The title and the noindex tag for this route are set by <DocumentMeta>.
 * ------------------------------------------------------------------------- */

const NotFound: React.FC = () => {
    const { t } = useLanguage();
    const { pathname } = useLocation();

    const stand = [
        { to: '/', name: t.notFound.linkWorks, note: t.notFound.linkWorksNote },
        { to: '/articles', name: t.notFound.linkLog, note: t.notFound.linkLogNote },
        { to: '/contact', name: t.notFound.linkContact, note: t.notFound.linkContactNote },
        { to: '/ai', name: t.notFound.linkMachine, note: t.notFound.linkMachineNote },
    ];

    return (
        <div className="w-full">
            <header className="container mx-auto px-6 pt-32 pb-12 md:px-24 md:pt-28">
                <div className="mx-auto w-full max-w-3xl">
                    <div className="mb-6">
                        <span className="kicker">{t.notFound.kicker}</span>
                    </div>
                    <h1 className="masthead mb-8 uppercase select-none">
                        {t.notFound.titleLead}{' '}
                        <span className="headline-accent">{t.notFound.titleAccent}</span>
                    </h1>
                    <div className="rule-double mb-8" />
                    <p className="standfirst measure">{t.notFound.standfirst}</p>
                </div>
            </header>

            <main className="container mx-auto px-6 pb-32 md:px-24">
                <div className="mx-auto w-full max-w-3xl">
                    {/* ---- the slip from the archive desk ---- */}
                    <section className="paper-panel mb-16 border-t-2 border-t-ink px-5 py-2 sm:px-6">
                        <div className="divide-y divide-rule">
                            <Row k={t.notFound.requestedLabel}>
                                <code className="font-mono text-[13px] break-all text-ink">
                                    {pathname}
                                </code>
                            </Row>
                            <Row k={t.notFound.statusLabel}>{t.notFound.statusValue}</Row>
                            <Row k={t.notFound.deskLabel}>{t.notFound.deskValue}</Row>
                        </div>
                    </section>

                    {/* ---- what is still on the stand ---- */}
                    <section>
                        <div className="mb-6 border-b-2 border-ink pb-2">
                            <h2 className="label">{t.notFound.stillInPrint}</h2>
                        </div>

                        <ul className="divide-y divide-rule border-b border-rule">
                            {stand.map((item) => (
                                <li key={item.to} className="py-3">
                                    <Link
                                        to={item.to}
                                        className="inline-flex min-h-11 items-center font-headline text-xl font-bold text-ink underline decoration-rule-strong underline-offset-4 transition-colors hover:text-accent"
                                    >
                                        {item.name}
                                    </Link>
                                    <p className="max-w-2xl text-[14px] leading-relaxed text-ink-body">
                                        {item.note}
                                    </p>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-12">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-3 border border-ink px-8 py-4 text-[11px] font-bold tracking-[0.2em] text-ink uppercase transition-colors hover:bg-ink hover:text-paper-raised"
                            >
                                <span aria-hidden="true">&larr;</span> {t.notFound.back}
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

/* Dotted leader line, the way the rest of the paper sets a key and a value. */
function Row({ k, children }: { k: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 py-2.5">
            <span className="folio shrink-0">{k}</span>
            <span className="hidden min-w-6 flex-1 translate-y-[-0.25em] border-b border-dotted border-rule-strong sm:block" />
            <span className="text-[14px] text-ink-body">{children}</span>
        </div>
    );
}

export default NotFound;

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/useLanguage';

/* ---------------------------------------------------------------------------
 *  Print colophon.
 *
 *  A sheet that comes off a printer loses everything the browser was holding
 *  around it: the address bar, the tab, the date. So the printed edition
 *  carries its own source line. A slug at the top of the run, and a proper
 *  colophon at the end with the address it was pulled from, the day it was
 *  pulled, and who to write to about it.
 *
 *  Both are display:none on screen and only ever appear on paper.
 *
 *  The stamp is re-read on `beforeprint`, so a tab left open overnight still
 *  prints the day it was actually printed rather than the day it was opened.
 * ------------------------------------------------------------------------- */

const SITE = 'EGUVEN.DEV';

const PrintColophon: React.FC<{ variant?: 'slug' | 'colophon' }> = ({ variant = 'colophon' }) => {
    const { t } = useLanguage();
    const { pathname } = useLocation();
    const [stamp, setStamp] = useState(() => new Date());

    useEffect(() => {
        const refresh = () => setStamp(new Date());
        window.addEventListener('beforeprint', refresh);

        /* Headless renderers and Safari flip the media query without ever
           firing beforeprint, so listen to both and take whichever arrives. */
        let media: MediaQueryList | null = null;
        try {
            media = window.matchMedia('print');
            media.addEventListener('change', refresh);
        } catch {
            media = null;
        }

        return () => {
            window.removeEventListener('beforeprint', refresh);
            media?.removeEventListener('change', refresh);
        };
    }, []);

    const url = `${window.location.origin}${pathname}`;
    const printed = stamp
        .toLocaleDateString(t.dateline.locale, { day: 'numeric', month: 'long', year: 'numeric' })
        .toLocaleUpperCase(t.dateline.locale);

    if (variant === 'slug') {
        return (
            <p className="print-only folio">
                {SITE}
                <span aria-hidden="true" className="px-2">
                    &middot;
                </span>
                <span className="normal-case tracking-[0.06em]">{url}</span>
            </p>
        );
    }

    return (
        <aside className="print-only">
            <hr className="rule-thick" />
            <p className="folio pt-2">
                {SITE}
                <span aria-hidden="true" className="px-2">
                    &middot;
                </span>
                <span className="normal-case tracking-[0.06em]">{url}</span>
                <span aria-hidden="true" className="px-2">
                    &middot;
                </span>
                {t.print.printed} {printed}
            </p>
            <p className="mt-1 text-[11px] text-ink-muted">{t.print.standing}</p>
        </aside>
    );
};

export default PrintColophon;

import { useLayoutEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';

/* ---------------------------------------------------------------------------
 *  MachineBar
 *
 *  The wire strip that runs above the masthead. A newspaper opens a note to
 *  its readers with "TO OUR READERS"; this one is addressed to the other half
 *  of the audience. Thin, monospace, one accent hit, dismissible.
 *
 *  It publishes its own height as --machine-bar-h so the fixed navbar can sit
 *  under it without either of them knowing about the other.
 * ------------------------------------------------------------------------- */

const STORAGE_KEY = 'eg:machine-bar';
const BAR_HEIGHT = '36px';

const readDismissed = (): boolean => {
    try {
        return window.localStorage.getItem(STORAGE_KEY) === 'dismissed';
    } catch {
        return false;
    }
};

const MachineBar: React.FC = () => {
    const location = useLocation();
    const { t } = useLanguage();
    const [dismissed, setDismissed] = useState(readDismissed);

    // Already reading the machine edition? Then the invitation is noise.
    const hidden = dismissed || location.pathname === '/ai';

    useLayoutEffect(() => {
        const root = document.documentElement;
        if (hidden) {
            root.style.removeProperty('--machine-bar-h');
        } else {
            root.style.setProperty('--machine-bar-h', BAR_HEIGHT);
        }
        return () => {
            root.style.removeProperty('--machine-bar-h');
        };
    }, [hidden]);

    if (hidden) return null;

    const dismiss = () => {
        setDismissed(true);
        try {
            window.localStorage.setItem(STORAGE_KEY, 'dismissed');
        } catch {
            /* private mode, blocked storage: the bar just comes back next visit */
        }
    };

    return (
        <div
            role="region"
            aria-label={t.machineBar.region}
            className="fixed top-0 left-0 w-full z-40 bg-paper-raised border-b border-rule-strong"
            style={{ height: BAR_HEIGHT }}
        >
            <div className="h-full flex items-center gap-2 sm:gap-4 px-3 sm:px-6 font-mono uppercase text-[10px] sm:text-[11px] tracking-[0.14em]">
                <span className="shrink-0 bg-ink text-paper-raised font-bold tracking-[0.2em] px-1.5 py-[3px] leading-none">
                    {t.machineBar.badge}
                </span>

                <span className="hidden min-w-0 sm:inline text-ink-muted truncate">
                    {t.machineBar.pitchLong}
                </span>
                <span className="min-w-0 truncate text-ink-muted sm:hidden">{t.machineBar.pitchShort}</span>

                <Link
                    to="/ai"
                    className="ml-auto flex h-full shrink-0 items-center gap-1 px-2 font-bold text-accent transition-colors hover:text-ink"
                >
                    <span className="hidden sm:inline">{t.machineBar.linkLong}</span>
                    <span className="sm:hidden">{t.machineBar.linkShort}</span>
                    <span aria-hidden="true">&rarr;</span>
                </Link>

                <button
                    type="button"
                    onClick={dismiss}
                    aria-label={t.machineBar.dismiss}
                    title={t.machineBar.dismiss}
                    /* The bar is only 36px tall, so the hit area takes the full
                       height and widens sideways rather than overflowing into
                       the page and swallowing clicks meant for the masthead. */
                    className="-mr-3 flex h-full w-11 shrink-0 items-center justify-center text-ink-faint transition-colors hover:text-ink sm:-mr-5"
                >
                    <X size={15} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};

export default MachineBar;

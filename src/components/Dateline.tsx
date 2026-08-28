import { useLanguage } from '../i18n/useLanguage';

/* ---------------------------------------------------------------------------
 *  Masthead dateline.
 *
 *  The strip a newspaper runs under its nameplate: where it was printed, the
 *  date, which issue of which volume, and what it costs. Page furniture, not a
 *  widget, so it sits inside the front page header rather than in the fixed
 *  chrome. The wire strip stays the topmost thing on screen.
 *
 *  The issue number is not a decoration: it is the number of days since the
 *  site went to press, so it moves on its own every morning. Move PRESS_START
 *  and the whole run renumbers.
 * ------------------------------------------------------------------------- */

/** First issue. Day one of the run; everything below counts from here. */
const PRESS_START = { year: 2026, month: 1, day: 1 };

const DAY = 86_400_000;

/** Whole days elapsed, compared UTC midnight to UTC midnight so a clock
 *  crossing a daylight saving boundary cannot skip or repeat an issue. */
const issueOf = (now: Date) => {
    const start = Date.UTC(PRESS_START.year, PRESS_START.month - 1, PRESS_START.day);
    const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const days = Math.max(0, Math.floor((today - start) / DAY));
    return { issue: days + 1, volume: Math.floor(days / 365) + 1 };
};

const Dot: React.FC<{ className?: string }> = ({ className = '' }) => (
    <span aria-hidden="true" className={`px-2 text-rule-strong sm:px-2.5 ${className}`}>
        &middot;
    </span>
);

const Dateline: React.FC<{ className?: string }> = ({ className = '' }) => {
    const { t } = useLanguage();
    const now = new Date();
    const locale = t.dateline.locale;

    const { issue, volume } = issueOf(now);

    /* Uppercased here rather than left to CSS: `toLocaleUpperCase` knows that
       Turkish "Nisan" goes to "NİSAN" and not "NISAN". */
    const date = now
        .toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
        .toLocaleUpperCase(locale);

    const edition = t.dateline.edition
        .replace('{volume}', volume.toLocaleString(locale))
        .replace('{issue}', issue.toLocaleString(locale));

    const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
        now.getDate(),
    ).padStart(2, '0')}`;

    /* Two halves, not four loose items. One line on a wide screen; on a phone
       the halves wrap onto a line each and the joining dot goes with them, so
       the strip never ends a line on a stranded separator. */
    return (
        <p
            aria-label={t.dateline.aria}
            className={`folio flex flex-wrap items-center gap-y-1 tracking-[0.14em] sm:tracking-[0.2em] ${className}`}
        >
            <span className="inline-flex items-center">
                {t.dateline.place}
                <Dot />
                <time dateTime={iso}>{date}</time>
            </span>

            <Dot className="hidden sm:inline-flex" />

            <span className="inline-flex items-center">
                {edition}
                <Dot />
                {t.dateline.price}
            </span>
        </p>
    );
};

export default Dateline;

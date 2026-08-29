import { toggleEdition, useEdition } from '../theme/edition';
import { useLanguage } from '../i18n/useLanguage';

/* ---------------------------------------------------------------------------
 *  AM / PM.
 *
 *  A paper does not have a dark mode, it has editions: the one that goes out
 *  before breakfast, and the one the presses run again in the evening. So the
 *  switch is a clock, which is how editions have always been named, and not a
 *  sun and a moon - two pictograms borrowed from an app, on a page that has
 *  no pictograms anywhere else in it.
 *
 *  Built to the same drawing as <LanguageToggle>, deliberately: the same
 *  folio type, the same slash, the same 44px box, state carried by weight
 *  rather than by a fill. Two small capitals beside two small capitals reads
 *  as a pair of press controls rather than as a widget that wandered in.
 *
 *  The label is the state; the accessible name and the tooltip are the
 *  action, and they say the plain word - dark, karanlık - so that nobody
 *  hunting for a dark mode has to first work out that this site calls it
 *  something else. There is a keyboard route too: `e`, listed on the card
 *  under `?`.
 *
 *  Unlike the edition switch next to it, this one is on every page. The
 *  machine edition is published in English only, so offering a language there
 *  would be a lie - but /ai is read at three in the morning like everything
 *  else, and the reader gets to decide what it is printed on.
 * ------------------------------------------------------------------------- */

const EditionToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
    const { t } = useLanguage();
    const edition = useEdition();
    const late = edition === 'late';

    const face = (on: boolean) =>
        on ? 'font-bold text-ink' : 'text-ink-faint transition-colors group-hover:text-ink-muted';

    return (
        <button
            type="button"
            onClick={() => toggleEdition()}
            aria-pressed={late}
            aria-label={late ? t.edition.switchToMorning : t.edition.switchToLate}
            title={late ? t.edition.morning : t.edition.late}
            className={`folio group inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-sm px-2 ${className}`}
        >
            <span className={face(!late)}>AM</span>
            <span aria-hidden="true" className="text-ink-faint">
                /
            </span>
            <span className={face(late)}>PM</span>
        </button>
    );
};

export default EditionToggle;

import { useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/useLanguage';

/* ---------------------------------------------------------------------------
 *  EN / TR.
 *
 *  A folio sized text switch, set in the same face as the rest of the page
 *  furniture. No flags: a flag is a country, not a language, and a small
 *  emoji next to newspaper capitals looks like a sticker on a printed page.
 *
 *  One real button, 44px tall so it clears the touch target the rest of the
 *  site was rebuilt for, labelled with the action rather than the state.
 *
 *  It sits in the fixed bar, which is z-50 and therefore stays above the
 *  mobile menu overlay at z-45. One control, reachable with the menu open or
 *  closed, rather than two identical ones on screen at once.
 *
 *  It disappears on /ai. The machine edition is published in English only,
 *  so offering a switch there would be a lie.
 * ------------------------------------------------------------------------- */

const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
    const { lang, t, toggle } = useLanguage();
    const { pathname } = useLocation();

    if (pathname === '/ai') return null;

    const face = (on: boolean) =>
        on ? 'font-bold text-ink' : 'text-ink-faint transition-colors group-hover:text-ink-muted';

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={t.lang.switchTo}
            title={t.lang.title}
            className={`folio group inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-sm px-2 ${className}`}
        >
            <span className={face(lang === 'en')}>EN</span>
            <span aria-hidden="true" className="text-ink-faint">
                /
            </span>
            <span className={face(lang === 'tr')}>TR</span>
        </button>
    );
};

export default LanguageToggle;

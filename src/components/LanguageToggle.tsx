import { useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/useLanguage';
import { FlagGB, FlagTR } from './Flags';

/* ---------------------------------------------------------------------------
 *  EN / TR, with the flags drawn in.
 *
 *  A flag is a country and not a language, which is why the codes stay: the
 *  flag is the thing you find at a glance, the code is the thing that is
 *  actually true. English is not England's alone, and the union flag here
 *  means "the English edition", nothing more.
 *
 *  Not emoji. Windows has no country flag glyphs, so an emoji flag renders
 *  there as two lettered boxes - a bug on the operating system most visitors
 *  are on. These are inline SVG, sixteen pixels wide, identical everywhere.
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

    /* The inactive side is dimmed rather than hidden, so the control still
       reads as a choice between two things. Flags carry their own colour, so
       the state is told by opacity on that side and by weight on the code. */
    const face = (on: boolean) =>
        on ? 'font-bold text-ink' : 'text-ink-faint transition-colors group-hover:text-ink-muted';
    const plate = (on: boolean) =>
        on ? 'opacity-100' : 'opacity-45 transition-opacity group-hover:opacity-75';

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={t.lang.switchTo}
            title={t.lang.title}
            className={`folio group inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-sm px-2 ${className}`}
        >
            <span className="inline-flex items-center gap-1">
                <FlagGB className={plate(lang === 'en')} />
                <span className={face(lang === 'en')}>EN</span>
            </span>
            <span aria-hidden="true" className="text-ink-faint">
                /
            </span>
            <span className="inline-flex items-center gap-1">
                <FlagTR className={plate(lang === 'tr')} />
                <span className={face(lang === 'tr')}>TR</span>
            </span>
        </button>
    );
};

export default LanguageToggle;

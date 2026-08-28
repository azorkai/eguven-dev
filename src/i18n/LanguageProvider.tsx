import { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LanguageContext } from './context';
import { en } from './en';
import { tr } from './tr';
import { isLang, type Lang } from './types';

/* ---------------------------------------------------------------------------
 *  Which edition to print.
 *
 *  English is the default press run: the site is aimed at remote roles abroad
 *  as much as at Istanbul. Turkish is chosen only when the reader has already
 *  told us something:
 *
 *    1. an explicit choice, remembered in localStorage, always wins;
 *    2. otherwise a browser asking for Turkish gets Turkish;
 *    3. otherwise English.
 *
 *  Every storage call is wrapped: in a private window `localStorage` can throw
 *  on access, not just on write, and a portfolio that white screens in
 *  incognito is worse than one that forgets a preference.
 *
 *  /ai is printed in English whatever the reader chose. The machine edition
 *  exists to hand the same facts to a parser, so the page and the furniture
 *  around it are one language and <html lang> can honestly say which. The
 *  stored preference is untouched, so leaving /ai lands back in Turkish.
 * ------------------------------------------------------------------------- */

const STORAGE_KEY = 'eg:lang';
const ENGLISH_ONLY = '/ai';

const DICTIONARIES = { en, tr };

const stored = (): Lang | null => {
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        return isLang(saved) ? saved : null;
    } catch {
        return null;
    }
};

const preferred = (): Lang => {
    try {
        const tags = [navigator.language, ...(navigator.languages ?? [])];
        if (tags.some((tag) => typeof tag === 'string' && tag.toLowerCase().startsWith('tr'))) {
            return 'tr';
        }
    } catch {
        /* no navigator worth trusting: fall through to English */
    }
    return 'en';
};

const initial = (): Lang => stored() ?? preferred();

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { pathname } = useLocation();
    const [lang, setLangState] = useState<Lang>(initial);

    const setLang = useCallback((next: Lang) => {
        setLangState(next);
        try {
            window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
            /* blocked storage: the choice holds for this visit only */
        }
    }, []);

    const value = useMemo(
        () => ({
            lang,
            t: pathname === ENGLISH_ONLY ? en : DICTIONARIES[lang],
            setLang,
            toggle: () => setLang(lang === 'tr' ? 'en' : 'tr'),
        }),
        [lang, pathname, setLang],
    );

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export default LanguageProvider;

import { createContext } from 'react';
import type { Dictionary } from './en';
import type { Lang } from './types';

export interface LanguageValue {
    lang: Lang;
    /** Short interface copy for the active language. */
    t: Dictionary;
    setLang: (next: Lang) => void;
    /** Flip to the other edition. */
    toggle: () => void;
}

/* No default value on purpose: reading this outside the provider is a bug,
   and useLanguage throws rather than silently rendering English. */
export const LanguageContext = createContext<LanguageValue | null>(null);

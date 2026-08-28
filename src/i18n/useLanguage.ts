import { useContext } from 'react';
import { LanguageContext, type LanguageValue } from './context';

export function useLanguage(): LanguageValue {
    const value = useContext(LanguageContext);
    if (!value) {
        throw new Error('useLanguage must be used inside <LanguageProvider>');
    }
    return value;
}

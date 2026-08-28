/* The two editions this site is printed in. English is the default press run;
   Turkish is picked up automatically when the browser asks for it. */
export type Lang = 'en' | 'tr';

export const LANGS: Lang[] = ['en', 'tr'];

export const isLang = (value: unknown): value is Lang =>
    value === 'en' || value === 'tr';

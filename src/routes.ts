/* ---------------------------------------------------------------------------
 *  Every address this site actually prints.
 *
 *  <App> mounts these and hands anything else to the 404 page; <DocumentMeta>
 *  reads the same list to know when the head has to say "not found" and mark
 *  the page noindex. One list, so the two can never disagree.
 * ------------------------------------------------------------------------- */

export const ROUTES = {
    home: '/',
    articles: '/articles',
    contact: '/contact',
    machine: '/ai',
    crmsolid: '/projects/crmsolid',
    playersells: '/projects/playersells',
} as const;

const KNOWN: string[] = Object.values(ROUTES);

/** Trailing slashes are the same address, the way the router already reads them. */
export const isKnownPath = (pathname: string): boolean =>
    KNOWN.includes(pathname.replace(/\/+$/, '') || '/');

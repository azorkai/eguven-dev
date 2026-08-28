import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/useLanguage';
import { crmsolidEn } from '../content/crmsolid.en';
import { crmsolidTr } from '../content/crmsolid.tr';
import { isKnownPath } from '../routes';

/* ---------------------------------------------------------------------------
 *  <html lang>, <title> and the meta description, in one place.
 *
 *  These used to be set per page, which is fine until two effects want the
 *  same two strings: child effects run before parent effects, so a page level
 *  title was reliably overwritten by an app level default a millisecond later.
 *  One component, keyed on route plus language, has no ordering to get wrong.
 *
 *  /ai is the exception on purpose. The machine edition is written in English
 *  for machine readers, so its head stays English and the document is marked
 *  lang="en" while it is on screen, whatever the interface language is.
 *
 *  An address the site does not print gets the 404 head and a noindex robots
 *  tag, so a crawler that followed a dead link does not file the archive desk
 *  page as if it were a page of the site. The tag is removed again on the way
 *  back out, because this is one long lived document, not a fresh one per
 *  navigation.
 * ------------------------------------------------------------------------- */

const MACHINE_EDITION = {
    lang: 'en',
    title: 'The Machine Edition | Emirhan Güven',
    desc:
        'A machine formatted edition of eguven.dev: the same facts as the rest of the site, ' +
        'set as structured, checkable blocks. Plain text copy at /llms.txt.',
};

/** Trailing slashes are the same address, the way the router reads them. */
const normalise = (pathname: string) => pathname.replace(/\/+$/, '') || '/';

const setRobots = (value: string | null) => {
    let tag = document.querySelector('meta[name="robots"]');
    if (value === null) {
        tag?.remove();
        return;
    }
    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'robots');
        document.head.appendChild(tag);
    }
    tag.setAttribute('content', value);
};

const DocumentMeta: React.FC = () => {
    const { pathname } = useLocation();
    const { lang, t } = useLanguage();

    useEffect(() => {
        const crm = lang === 'tr' ? crmsolidTr : crmsolidEn;
        const path = normalise(pathname);
        const known = isKnownPath(path);

        let head = { lang: lang as string, title: t.meta.homeTitle, desc: t.meta.homeDesc };

        if (path === '/ai') {
            head = MACHINE_EDITION;
        } else if (path === '/articles') {
            head = { lang, title: t.meta.articlesTitle, desc: t.meta.articlesDesc };
        } else if (path === '/contact') {
            head = { lang, title: t.meta.contactTitle, desc: t.meta.contactDesc };
        } else if (path === '/projects/crmsolid') {
            head = { lang, title: crm.meta.title, desc: crm.meta.desc };
        } else if (!known) {
            head = { lang, title: t.meta.notFoundTitle, desc: t.meta.notFoundDesc };
        }

        document.documentElement.lang = head.lang;
        document.title = head.title;

        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute('content', head.desc);

        setRobots(known ? null : 'noindex, follow');
    }, [pathname, lang, t]);

    return null;
};

export default DocumentMeta;

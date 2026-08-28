import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/useLanguage';
import { crmsolidEn } from '../content/crmsolid.en';
import { crmsolidTr } from '../content/crmsolid.tr';

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
 * ------------------------------------------------------------------------- */

const MACHINE_EDITION = {
    lang: 'en',
    title: 'The Machine Edition | Emirhan Güven',
    desc:
        'A machine formatted edition of eguven.dev: the same facts as the rest of the site, ' +
        'set as structured, checkable blocks. Plain text copy at /llms.txt.',
};

const DocumentMeta: React.FC = () => {
    const { pathname } = useLocation();
    const { lang, t } = useLanguage();

    useEffect(() => {
        const crm = lang === 'tr' ? crmsolidTr : crmsolidEn;

        let head = { lang: lang as string, title: t.meta.homeTitle, desc: t.meta.homeDesc };

        if (pathname === '/ai') {
            head = MACHINE_EDITION;
        } else if (pathname === '/articles') {
            head = { lang, title: t.meta.articlesTitle, desc: t.meta.articlesDesc };
        } else if (pathname === '/contact') {
            head = { lang, title: t.meta.contactTitle, desc: t.meta.contactDesc };
        } else if (pathname === '/projects/crmsolid') {
            head = { lang, title: crm.meta.title, desc: crm.meta.desc };
        }

        document.documentElement.lang = head.lang;
        document.title = head.title;

        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute('content', head.desc);
    }, [pathname, lang, t]);

    return null;
};

export default DocumentMeta;

import { useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';

/* ---------------------------------------------------------------------------
 *  WHICH EDITION IS ON THE STAND
 *
 *  A paper does not have a "dark mode", it has editions. The one that goes out
 *  before breakfast is set on white stock; the one the presses run again in
 *  the evening - the late edition, the night final - is the same paper printed
 *  in the dark. So the switch here is AM / PM, and everything below is written
 *  in those terms: `morning` is the paper stock, `late` is the night ink.
 *
 *  The whole theme already lives in index.css under `.dark`. Nothing in this
 *  file knows a single colour: it puts one class on <html> and gets out of the
 *  way.
 *
 *  WHO DECIDES, in order:
 *    1. an explicit choice, remembered in localStorage, always wins and keeps
 *       winning - including when the reader's OS flips underneath the tab;
 *    2. otherwise `prefers-color-scheme`, live: no stored choice means the
 *       site follows the system for as long as the tab is open;
 *    3. otherwise the morning edition.
 *
 *  THE FIRST FRAME IS NOT OURS. The class is already on <html> before this
 *  module is parsed - a five line synchronous script in index.html does it
 *  ahead of the stylesheet, which is the only way to open a dark page dark.
 *  So the state here is READ OFF THE DOM rather than kept beside it: there is
 *  exactly one source of truth and no first render that disagrees with the
 *  paint that already happened.
 *
 *  Every storage call is wrapped. In a private window `localStorage` throws on
 *  access, not just on write, and a portfolio that white screens in incognito
 *  is worse than one that forgets a preference.
 * ------------------------------------------------------------------------- */

export type Edition = 'morning' | 'late';

const STORAGE_KEY = 'eg:edition';
/** The class index.css hangs the whole night theme off. */
const NIGHT = 'dark';
/** Armed only while a change is being printed. It scopes the view transition
 *  rules in index.css so they can never reach another transition the site
 *  might grow, and it holds the page's own colour transitions still for the
 *  length of the pass - the edge is what moves, nothing else. */
const TURNING = 'edition-turning';

/** The nip runs a little slower than a page change (220ms): a new edition is
 *  a bigger event than a new page, and it is one sweep rather than a swap. */
const SWEEP_MS = 420;
/** The roller, from <PageTransition>. Same cylinder, same speed. */
const ROLLER = 'cubic-bezier(0.3, 0.62, 0.4, 1)';

const isEdition = (value: unknown): value is Edition =>
    value === 'morning' || value === 'late';

/* ---- what the reader has told us ---------------------------------------- */

const stored = (): Edition | null => {
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        return isEdition(saved) ? saved : null;
    } catch {
        return null;
    }
};

const nightOutside = (): MediaQueryList | null => {
    try {
        return window.matchMedia('(prefers-color-scheme: dark)');
    } catch {
        return null;
    }
};

const stillness = (): boolean => {
    try {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
        return false;
    }
};

/* ---- the DOM is the state ------------------------------------------------ */

/** What is actually on the page right now. */
export const edition = (): Edition =>
    document.documentElement.classList.contains(NIGHT) ? 'late' : 'morning';

/** Put the edition on the document. Colour comes from index.css; the two
 *  things a stylesheet cannot reach - the phone's browser chrome and the very
 *  first paint of the root box - are re-read from the theme rather than
 *  written out again here, so this file still knows no colours. */
const ink = (next: Edition) => {
    const root = document.documentElement;
    root.classList.toggle(NIGHT, next === 'late');

    const paper = window.getComputedStyle(root).getPropertyValue('--color-paper').trim();
    if (paper) {
        /* Matches the stylesheet exactly, and holds the stock under the page
           before the stylesheet is there - see index.html. */
        root.style.backgroundColor = paper;
        document
            .querySelector('meta[name="theme-color"]')
            ?.setAttribute('content', paper);
    }
};

/* ---- subscribers --------------------------------------------------------- */

const readers = new Set<() => void>();
const emit = () => readers.forEach((notify) => notify());

const subscribe = (notify: () => void) => {
    readers.add(notify);
    return () => {
        readers.delete(notify);
    };
};

/* ---- the fallback sweep --------------------------------------------------
   Firefox, and every Safari before 18, have no view transitions. They get the
   same move built by hand: a sheet of the OUTGOING stock, laid over the whole
   viewport on the frame the edition changes, then pulled down off the bottom
   of the screen. The new edition is underneath from the first frame, so what
   travels is only the edge where the printing stops - the same thing that
   happens between two pages, with the same rule and the same red hairline
   trailing it at the nip. */

const sweep = (next: Edition) => {
    const root = document.documentElement;
    root.classList.add(TURNING);
    const was = window.getComputedStyle(root);
    const paper = was.getPropertyValue('--color-paper').trim();
    const grain = was.getPropertyValue('--paper-noise').trim();
    const rule = was.getPropertyValue('--color-rule-strong').trim();
    const red = was.getPropertyValue('--color-accent').trim();

    const sheet = document.createElement('div');
    sheet.className = 'edition-sheet';
    sheet.setAttribute('aria-hidden', 'true');
    sheet.setAttribute('data-print', 'hide');
    sheet.style.backgroundColor = paper;
    if (grain && grain !== 'none') sheet.style.backgroundImage = grain;
    sheet.style.borderTopColor = rule;

    const nip = document.createElement('span');
    nip.className = 'edition-nip';
    nip.style.backgroundColor = red;
    sheet.appendChild(nip);

    document.body.appendChild(sheet);

    /* Under the sheet, on the same frame. */
    ink(next);
    emit();

    if (typeof sheet.animate !== 'function') {
        sheet.remove();
        root.classList.remove(TURNING);
        return;
    }

    const off = () => {
        sheet.remove();
        root.classList.remove(TURNING);
    };
    sheet
        .animate([{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(0,100%,0)' }], {
            duration: SWEEP_MS,
            easing: ROLLER,
            fill: 'forwards',
        })
        .finished.then(off, off);
};

/* ---- the change ---------------------------------------------------------- */

type ViewTransition = { finished: Promise<void> };
type WithTransitions = Document & {
    startViewTransition?: (update: () => void) => ViewTransition;
};

const print = (next: Edition) => {
    if (next === edition()) return;

    /* Asked for stillness: the edition changes, nothing moves. */
    if (stillness()) {
        ink(next);
        emit();
        return;
    }

    const doc = document as WithTransitions;

    if (typeof doc.startViewTransition === 'function') {
        const root = document.documentElement;
        root.classList.add(TURNING);
        const pass = doc.startViewTransition(() => {
            /* Synchronous on purpose: the browser captures the new state as
               soon as this returns, and a switch that repainted a frame late
               would be caught mid-change inside its own snapshot. */
            flushSync(() => {
                ink(next);
                emit();
            });
        });
        const done = () => root.classList.remove(TURNING);
        pass.finished.then(done, done);
        return;
    }

    sweep(next);
};

/* ---- the two ways in ----------------------------------------------------- */

/** An explicit choice. Remembered, and it outranks the system from now on. */
export const setEdition = (next: Edition) => {
    try {
        window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
        /* blocked storage: the choice holds for this visit only */
    }
    print(next);
};

/** The switch, and the `e` key. */
export const toggleEdition = () => setEdition(edition() === 'late' ? 'morning' : 'late');

/* ---- following the system ------------------------------------------------
   Only while the reader has not said otherwise. Registered once, at module
   scope, because it has to work whether or not anything is mounted. */

nightOutside()?.addEventListener('change', (event) => {
    if (stored()) return;
    print(event.matches ? 'late' : 'morning');
});

/* ---- for components ------------------------------------------------------ */

export const useEdition = (): Edition =>
    useSyncExternalStore(subscribe, edition, () => 'morning' as Edition);

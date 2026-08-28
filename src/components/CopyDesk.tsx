import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { ROUTES } from '../routes';
import { useLanguage } from '../i18n/useLanguage';

/* ---------------------------------------------------------------------------
 *  THE DESK  ( keyboard )
 *
 *  Every newsroom system anybody has ever had to work in is driven from the
 *  keyboard, because a sub-editor moving between pages two hundred times a
 *  shift is not going to reach for a mouse. So this site has the same thing,
 *  and it is spelled the way editorial systems and everything since have
 *  spelled it: `?` shows the card, `g` then a letter goes somewhere.
 *
 *    ?          the card, on and off
 *    g p        the works        g l   the log
 *    g c        contact          g m   the machine edition
 *    t          the console, which otherwise has a button on wide screens only
 *    esc        closes the card
 *
 *  WHAT IT REFUSES TO DO, which is most of the design:
 *
 *    - it does not listen while the reader is typing. Anything with a caret in
 *      it, a form field or an editable node, keeps every key it is given: `g`
 *      in the message box is a `g`.
 *    - it does not listen while the console is open. The terminal has its own
 *      keyboard, and the games inside it own the arrows, `p` and Escape.
 *    - it never touches a key with ctrl, meta or alt held. Browser and system
 *      shortcuts are not ours to take, Ctrl+P above all: that one prints the
 *      newspaper edition and the card only tells you it is there.
 *    - it holds the `g` for a second and a bit and then forgets it, so a
 *      stranded `g` cannot swallow the next thing typed.
 *
 *  The card is a dialog with one control in it and Escape always closes it, so
 *  there is nothing here for a keyboard to get caught in. Focus goes to the
 *  close button on the way in and back where it came from on the way out.
 * ------------------------------------------------------------------------- */

/** How long a lone `g` waits for the letter that finishes it. */
const CHORD_MS = 1200;

const GO: Record<string, string> = {
    p: ROUTES.home,
    l: ROUTES.articles,
    c: ROUTES.contact,
    m: ROUTES.machine,
};

const isTyping = (target: EventTarget | null): boolean => {
    if (!(target instanceof HTMLElement)) return false;
    if (target.isContentEditable) return true;
    return /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
};

/* One label, so the print row is honest on the machine the reader is on. */
const isMac = (): boolean => {
    try {
        return /Mac|iPhone|iPad/i.test(navigator.userAgent);
    } catch {
        return false;
    }
};

const Key: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    /* `font-serif` on purpose: <kbd> defaults to monospace, and on this site
       monospace means code. A key cap is furniture, so it is set in the same
       face as everything else and the box is what says it is a key. */
    <kbd className="inline-flex min-w-[1.7rem] items-center justify-center rounded-sm border border-rule-strong bg-paper-sunk px-1.5 py-1 font-serif text-[12.5px] leading-none font-semibold tracking-wide text-ink">
        {children}
    </kbd>
);

const Row: React.FC<{ keys: React.ReactNode; children: React.ReactNode }> = ({ keys, children }) => (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2.5">
        <span className="flex shrink-0 items-baseline gap-1.5">{keys}</span>
        <span className="hidden min-w-6 flex-1 translate-y-[-0.25em] border-b border-dotted border-rule-strong sm:block" />
        <span className="text-[14px] text-ink-body">{children}</span>
    </div>
);

type Props = {
    /** The console owns the keyboard while it is open. */
    terminalOpen: boolean;
    onOpenTerminal: () => void;
};

const CopyDesk: React.FC<Props> = ({ terminalOpen, onOpenTerminal }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const reduced = useReducedMotion() ?? false;

    const [open, setOpen] = useState(false);
    const armed = useRef(false);
    const chord = useRef(0);
    const opener = useRef<Element | null>(null);
    const closeButton = useRef<HTMLButtonElement>(null);

    const close = useCallback(() => setOpen(false), []);

    useEffect(() => {
        const disarm = () => {
            armed.current = false;
            if (chord.current) {
                window.clearTimeout(chord.current);
                chord.current = 0;
            }
        };

        const onKey = (event: KeyboardEvent) => {
            if (event.defaultPrevented || event.repeat || event.isComposing) return;
            if (event.ctrlKey || event.metaKey || event.altKey) return;
            if (terminalOpen || isTyping(event.target)) return;

            if (event.key === 'Escape') {
                disarm();
                setOpen(false);
                return;
            }

            /* `?` on this keyboard, or the physical key that carries it on a
               keyboard that puts the question mark somewhere else. */
            if (event.key === '?' || (event.shiftKey && event.code === 'Slash')) {
                event.preventDefault();
                disarm();
                setOpen((was) => !was);
                return;
            }

            const key = event.key.toLowerCase();

            if (armed.current) {
                const address = GO[key];
                disarm();
                if (address) {
                    event.preventDefault();
                    setOpen(false);
                    navigate(address);
                }
                return;
            }

            if (key === 'g') {
                armed.current = true;
                chord.current = window.setTimeout(disarm, CHORD_MS);
                return;
            }

            if (key === 't') {
                event.preventDefault();
                setOpen(false);
                onOpenTerminal();
            }
        };

        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('keydown', onKey);
            disarm();
        };
    }, [navigate, onOpenTerminal, terminalOpen]);

    /* In: remember where the reader was and put them on the only control the
       card has. Out: hand the focus straight back. */
    useEffect(() => {
        if (open) {
            opener.current = document.activeElement;
            closeButton.current?.focus();
            return;
        }
        const back = opener.current;
        opener.current = null;
        if (back instanceof HTMLElement && document.contains(back)) back.focus();
    }, [open]);

    const print = isMac() ? '⌘' : 'ctrl';

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    data-print="hide"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.14 }}
                    className="fixed inset-0 z-[70] flex items-center justify-center px-5 py-10"
                >
                    <div
                        aria-hidden="true"
                        onClick={close}
                        className="absolute inset-0 bg-ink/25"
                    />

                    <motion.div
                        role="dialog"
                        aria-label={t.desk.title}
                        data-copy-credit="off"
                        initial={reduced ? false : { y: 8 }}
                        animate={{ y: 0 }}
                        transition={{ duration: reduced ? 0 : 0.18, ease: 'easeOut' }}
                        className="paper-panel relative max-h-full w-full max-w-md overflow-y-auto border-t-2 border-t-ink px-5 py-5 shadow-xl sm:px-7 sm:py-6"
                    >
                        <button
                            type="button"
                            ref={closeButton}
                            onClick={close}
                            aria-label={t.desk.close}
                            title={t.desk.close}
                            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center text-ink-faint transition-colors hover:text-ink"
                        >
                            <X size={16} />
                        </button>

                        <h2 className="label">{t.desk.title}</h2>
                        <p className="folio mt-1 text-ink-faint">{t.desk.subtitle}</p>
                        <div className="rule-double mt-3 mb-5" />

                        <h3 className="label mb-1 border-b border-rule pb-2 text-[11px]">
                            {t.desk.goHead}
                        </h3>
                        <div className="divide-y divide-rule">
                            <Row
                                keys={
                                    <>
                                        <Key>g</Key>
                                        <span className="text-[12px] text-ink-faint">{t.desk.then}</span>
                                        <Key>p</Key>
                                    </>
                                }
                            >
                                {t.desk.goProjects}
                            </Row>
                            <Row
                                keys={
                                    <>
                                        <Key>g</Key>
                                        <span className="text-[12px] text-ink-faint">{t.desk.then}</span>
                                        <Key>l</Key>
                                    </>
                                }
                            >
                                {t.desk.goLog}
                            </Row>
                            <Row
                                keys={
                                    <>
                                        <Key>g</Key>
                                        <span className="text-[12px] text-ink-faint">{t.desk.then}</span>
                                        <Key>c</Key>
                                    </>
                                }
                            >
                                {t.desk.goContact}
                            </Row>
                            <Row
                                keys={
                                    <>
                                        <Key>g</Key>
                                        <span className="text-[12px] text-ink-faint">{t.desk.then}</span>
                                        <Key>m</Key>
                                    </>
                                }
                            >
                                {t.desk.goMachine}
                            </Row>
                        </div>

                        <h3 className="label mt-6 mb-1 border-b border-rule pb-2 text-[11px]">
                            {t.desk.pageHead}
                        </h3>
                        <div className="divide-y divide-rule">
                            <Row keys={<Key>t</Key>}>{t.desk.console}</Row>
                            <Row
                                keys={
                                    <>
                                        <Key>{print}</Key>
                                        <Key>p</Key>
                                    </>
                                }
                            >
                                {t.desk.print}
                            </Row>
                            <Row keys={<Key>?</Key>}>{t.desk.card}</Row>
                            <Row keys={<Key>esc</Key>}>{t.desk.dismiss}</Row>
                        </div>

                        <p className="mt-5 border-t border-rule pt-3 text-[13px] leading-relaxed text-ink-muted">
                            {t.desk.note}
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CopyDesk;

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../i18n/useLanguage';

/* ---------------------------------------------------------------------------
 *  CASTING OFF THE COPY
 *
 *  Before a story could be set, somebody on the desk had to work out how much
 *  of the page it was going to eat. That job is called casting off: you count
 *  the copy and turn it into the only unit the page understands, which is not
 *  words but space. English papers count column inches; Turkish papers still
 *  sell and measure in sütun santimi, the column centimetre, which is why the
 *  two editions here do not measure the same thing.
 *
 *  So: drag over a real passage of this site and the desk does what it always
 *  did with a passage of copy. It measures it.
 *
 *  Rules, all of them about staying out of the way:
 *
 *    - it needs a PASSAGE. Under MIN_WORDS a selection is somebody grabbing an
 *      email address or a version number, and a measurement slip stapled to
 *      three words is a nuisance, not a joke.
 *    - it never measures monospace. The terminal, the code spans and the wire
 *      blocks on /ai are not copy, they are code, and code is not cast off.
 *      Same rule the clipboard credit already keeps to.
 *    - it never measures the reader's own typing in a form field.
 *    - it is `select-none`, so a second Ctrl+A cannot pull the slip's own text
 *      into the selection it is describing.
 *    - it is aria-hidden. A live region firing on every drag would read the
 *      same three numbers over a screen reader for the whole page, which is
 *      the opposite of a small pleasure.
 *
 *  Cost: one `selectionchange` listener, and the work inside it is throttled
 *  to a frame, so dragging across the page is one measurement per paint and
 *  not one per pixel. No timers, no polling, no state while nothing is
 *  selected.
 * ------------------------------------------------------------------------- */

/** Below this a selection is a lookup, not a passage. */
const MIN_WORDS = 25;

/** Where the clipboard credit stays out, so does the tape measure. */
const VERBATIM = 'code, pre, kbd, samp, input, textarea, [data-copy-credit="off"]';

const elementOf = (node: Node | null): Element | null => {
    if (!node) return null;
    return node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
};

const isVerbatim = (el: Element | null): boolean => {
    if (!el) return false;
    if (el.closest(VERBATIM)) return true;
    if (el.closest('[contenteditable=""], [contenteditable="true"]')) return true;
    try {
        return /mono/i.test(window.getComputedStyle(el).fontFamily);
    } catch {
        return false;
    }
};

const CastOff: React.FC = () => {
    const { t } = useLanguage();
    const reduced = useReducedMotion() ?? false;
    const [words, setWords] = useState(0);
    const frame = useRef(0);

    useEffect(() => {
        const measure = () => {
            frame.current = 0;

            const active = document.activeElement;
            if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) {
                setWords(0);
                return;
            }

            const selection = window.getSelection();
            if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
                setWords(0);
                return;
            }

            const text = selection.toString().trim();
            if (!text) {
                setWords(0);
                return;
            }

            const range = selection.getRangeAt(0);
            if (isVerbatim(elementOf(range.commonAncestorContainer))) {
                setWords(0);
                return;
            }

            const count = text.split(/\s+/).length;
            setWords(count >= MIN_WORDS ? count : 0);
        };

        /* One measurement per paint. A drag across a long page fires
           selectionchange dozens of times a second; this makes that free. */
        const onChange = () => {
            if (frame.current) return;
            frame.current = window.requestAnimationFrame(measure);
        };

        document.addEventListener('selectionchange', onChange);
        return () => {
            document.removeEventListener('selectionchange', onChange);
            if (frame.current) window.cancelAnimationFrame(frame.current);
        };
    }, []);

    const locale = t.dateline.locale;
    const space = (words / t.castOff.wordsPerUnit).toLocaleString(locale, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    });

    return (
        <AnimatePresence>
            {words > 0 && (
                <motion.aside
                    aria-hidden="true"
                    data-print="hide"
                    data-copy-credit="off"
                    initial={reduced ? { opacity: 1 } : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
                    transition={{ duration: reduced ? 0 : 0.16, ease: 'easeOut' }}
                    className="paper-panel pointer-events-none fixed right-4 bottom-4 z-[38] max-w-[calc(100vw-2rem)] border-t-2 border-t-ink px-3 py-2 select-none sm:right-6 sm:bottom-6"
                >
                    <p className="folio text-ink">{t.castOff.label}</p>
                    <p className="folio mt-1 tracking-[0.14em] text-ink-muted">
                        {words.toLocaleString(locale)} {t.castOff.words}
                        <span aria-hidden="true" className="px-1.5 text-rule-strong">
                            &middot;
                        </span>
                        {space} {t.castOff.unit}
                    </p>
                </motion.aside>
            )}
        </AnimatePresence>
    );
};

export default CastOff;

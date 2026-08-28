import { useEffect } from 'react';
import { useLanguage } from '../i18n/useLanguage';

/* ---------------------------------------------------------------------------
 *  Clipboard credit.
 *
 *  Lift a paragraph off this site and the clipboard gets the same line a
 *  newspaper cuttings service would staple to the bottom of a clipping: who
 *  wrote it, where it ran, and when it was taken.
 *
 *  The whole feature lives or dies on when it stays out of the way. It fires
 *  only on a real passage of running text. It never touches:
 *
 *    - a short selection. Copying a name, a number or one phrase is a lookup,
 *      not a quotation, and a footer stapled to two words is vandalism.
 *    - anything monospace: code spans, the terminal, the wire blocks on /ai.
 *      Pasting a broken command into a shell would be a genuine bug.
 *    - a form field, where the copied text is the reader's own.
 *
 *  The selection itself is passed through untouched. The credit is appended
 *  after a blank line, and nothing in between is rewritten.
 * ------------------------------------------------------------------------- */

/** Below this many characters a selection is a lookup, not a quotation. */
const MIN_CHARS = 60;

/** Contexts where the clipboard has to stay byte for byte what was selected. */
const VERBATIM = 'code, pre, kbd, samp, input, textarea, [data-copy-credit="off"]';

const elementOf = (node: Node | null): Element | null => {
    if (!node) return null;
    return node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
};

/* Computed font-family is inherited, so one look at the deepest element that
   contains the whole selection answers "is this set in monospace" for every
   node inside it. Catches `.font-mono` wrappers that are not <code>. */
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

const escapeHtml = (value: string): string => {
    const box = document.createElement('span');
    box.textContent = value;
    return box.innerHTML;
};

const CopyCredit: React.FC = () => {
    const { t } = useLanguage();

    useEffect(() => {
        const onCopy = (event: ClipboardEvent) => {
            const data = event.clipboardData;
            if (!data) return;

            /* The reader's own typing, in their own field. */
            const active = document.activeElement;
            if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) return;

            const selection = window.getSelection();
            if (!selection || selection.isCollapsed || selection.rangeCount === 0) return;

            const text = selection.toString();
            if (text.trim().length < MIN_CHARS) return;

            const range = selection.getRangeAt(0);
            if (isVerbatim(elementOf(range.commonAncestorContainer))) return;

            const url = `${window.location.origin}${window.location.pathname}`;
            const date = new Date().toLocaleDateString(t.copyCredit.locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
            const credit = `${t.copyCredit.source} ${t.copyCredit.name}, ${url}, ${date}`;

            /* Rebuild the rich flavour from the same range the browser would
               have serialised, then staple the credit on as its own paragraph. */
            const box = document.createElement('div');
            box.appendChild(range.cloneContents());
            const html =
                `${box.innerHTML}<p>${escapeHtml(`${t.copyCredit.source} ${t.copyCredit.name}, `)}` +
                `<a href="${escapeHtml(url)}">${escapeHtml(url)}</a>` +
                `${escapeHtml(`, ${date}`)}</p>`;

            event.preventDefault();
            data.setData('text/plain', `${text}\n\n${credit}`);
            data.setData('text/html', html);
        };

        document.addEventListener('copy', onCopy);
        return () => document.removeEventListener('copy', onCopy);
    }, [t]);

    return null;
};

export default CopyCredit;

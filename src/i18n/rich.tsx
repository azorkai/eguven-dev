import { Fragment, type ReactNode } from 'react';

/* ---------------------------------------------------------------------------
 *  Inline markup for translated copy.
 *
 *  Translations live in plain .ts files as strings, which keeps them readable
 *  and diffable. Two marks are allowed inside them, both rare:
 *
 *      `identifier`   a monospace code span
 *      ==phrase==     the highlighter pass, one per view
 *
 *  Anything else is literal text. No HTML is parsed, so a translation can
 *  never inject markup.
 * ------------------------------------------------------------------------- */

const TOKEN = /(`[^`]+`|==[^=]+==)/g;

export function rich(text: string): ReactNode {
    return text.split(TOKEN).map((part, i) => {
        if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
            return (
                <code key={i} className="font-mono text-[0.86em] text-ink">
                    {part.slice(1, -1)}
                </code>
            );
        }
        if (part.length > 4 && part.startsWith('==') && part.endsWith('==')) {
            return (
                <span key={i} className="marker">
                    {part.slice(2, -2)}
                </span>
            );
        }
        return <Fragment key={i}>{part}</Fragment>;
    });
}

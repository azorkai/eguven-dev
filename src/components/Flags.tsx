/* ---------------------------------------------------------------------------
 *  TWO FLAGS, DRAWN RATHER THAN TYPED
 *
 *  Emoji flags were the obvious route and they do not work: Windows ships no
 *  country flag glyphs at all, so a regional indicator pair falls back to the
 *  two letters in boxes. On the operating system most visitors are using, an
 *  emoji flag is a bug.
 *
 *  So they are inline SVG. 16x12 at a 4:3 ratio, the proportion a flag is
 *  usually drawn at in a list, with a hairline border because both flags carry
 *  white to their edges and would otherwise dissolve into the paper.
 *
 *  Simplified on purpose. At sixteen pixels the crescent's inner arc and the
 *  saltire's fimbriations are below the resolution of the thing being drawn,
 *  so what is kept is the silhouette each flag is recognised by: red field,
 *  crescent, star; and the two crosses over the diagonals.
 * ------------------------------------------------------------------------- */

type Props = { className?: string };

const box = 'block h-[12px] w-[16px] shrink-0 rounded-[1px] ring-1 ring-ink/15';

export const FlagTR: React.FC<Props> = ({ className = '' }) => (
    <svg viewBox="0 0 16 12" className={`${box} ${className}`} aria-hidden="true" focusable="false">
        <rect width="16" height="12" fill="#E30A17" />
        {/* Crescent: a white disc with a red one bitten out of it. */}
        <circle cx="6.1" cy="6" r="2.7" fill="#fff" />
        <circle cx="7.0" cy="6" r="2.15" fill="#E30A17" />
        {/* Star, five points, small enough that the arms read as one mark. */}
        <path
            fill="#fff"
            d="M10.35 6 9.1 6.42l.77-1.06v1.31l-.77-1.06zm0 0 1.25.42-.77-1.06v1.31l.77-1.06z"
        />
        <circle cx="10.5" cy="6" r="1.05" fill="#fff" />
        <circle cx="10.5" cy="6" r="0.42" fill="#E30A17" />
    </svg>
);

export const FlagGB: React.FC<Props> = ({ className = '' }) => (
    <svg viewBox="0 0 16 12" className={`${box} ${className}`} aria-hidden="true" focusable="false">
        <rect width="16" height="12" fill="#012169" />
        {/* Saltire, white then red, drawn as strokes so it stays crisp small. */}
        <path d="M0 0 16 12M16 0 0 12" stroke="#fff" strokeWidth="2.6" />
        <path d="M0 0 16 12M16 0 0 12" stroke="#C8102E" strokeWidth="1.2" />
        {/* Cross of St George over the top. */}
        <path d="M8 0v12M0 6h16" stroke="#fff" strokeWidth="4" />
        <path d="M8 0v12M0 6h16" stroke="#C8102E" strokeWidth="2.2" />
    </svg>
);

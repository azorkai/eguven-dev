import { useCallback, useState, useSyncExternalStore } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ROUTES, isKnownPath } from '../routes';

/* ---------------------------------------------------------------------------
 *  THE PRESS PASS
 *
 *  Moving between pages here is not a screen effect, it is a sheet coming off
 *  a press. Three things happen at once, and all three are things that happen
 *  to paper rather than to pixels:
 *
 *    1. THE NIP. A sheet of the page's own stock covers the viewport and is
 *       pulled downward. Because it is exactly the paper colour and carries
 *       the same grain, you never see a panel move - only the edge where the
 *       print stops. The page arrives top first, out of a roller.
 *
 *    2. THE INK SETTLES. The incoming page comes in light and gains its full
 *       weight as it clears the nip. That is opacity against paper, which is
 *       what light ink is; no colour is animated and nothing blurs.
 *
 *    3. MISREGISTRATION. On a press the red plate lands a hair off the black
 *       one. So the red furniture - the section stamp, and a ghost of the
 *       masthead rule - arrives 2px out and pulls into register inside the
 *       first tenth of a second. (index.css: `press-register`.)
 *
 *  SPEED IS THE FEATURE. The whole pass is 220ms on a desktop and 180ms on a
 *  phone, and there is no exit animation at all: the outgoing page is simply
 *  gone, which nobody can see, because the incoming sheet already covers the
 *  viewport on the very frame that replaces it. Nothing waits for anything.
 *  A transition you wait for is a transition that failed, so the only thing
 *  between the click and the new page is the paper.
 *
 *  That same sheet is why there is no jump either: the scroll reset, the
 *  document height change and the swap all happen underneath it.
 *
 *  Everything animated is `transform` or `opacity` - two composited layers,
 *  no filters, nothing re-rasterised per frame.
 *
 *  THE VARIANTS. Where you are going changes how it is printed, and none of
 *  them costs a millisecond more than the others:
 *
 *    sheet     the paper, for every page that is set as prose.
 *    wire      /ai. The machine edition speaks teleprinter, so its sheet does
 *              not glide, it advances off a platen in whole lines, and no
 *              second colour is laid down: a wire machine has one ribbon.
 *    misprint  anything never filed. The red plate lands twice as far out and
 *              the sheet comes through a couple of px sideways before it
 *              corrects. A page that does not exist prints badly.
 *
 *  Reduced motion gets none of it: 100ms of opacity, and nothing that moves.
 * ------------------------------------------------------------------------- */

type Press = 'sheet' | 'wire' | 'misprint';

const pressFor = (pathname: string): Press => {
    const clean = pathname.replace(/\/+$/, '') || '/';
    if (clean === ROUTES.machine) return 'wire';
    return isKnownPath(clean) ? 'sheet' : 'misprint';
};

/** The roller. A cylinder turns at one speed, so this is close to linear -
 *  away without a wind-up, and only enough ease at the end that the sheet
 *  lands rather than stops. Anything more front-loaded reads as a flash
 *  followed by a crawl, which is the thing that makes a transition feel long. */
const ROLLER: [number, number, number, number] = [0.3, 0.62, 0.4, 1];

/** The platen advances in whole lines, so the wire sheet moves in steps. */
const LINES = 4;
const platen = (p: number): number => Math.ceil(p * LINES) / LINES;

/* ---- narrow screens do less ---------------------------------------------
   Not a different animation - the same one with the travel and the clock
   turned down. */

const useMedia = (query: string): boolean => {
    const subscribe = useCallback(
        (notify: () => void) => {
            const mql = window.matchMedia(query);
            mql.addEventListener('change', notify);
            return () => mql.removeEventListener('change', notify);
        },
        [query],
    );
    return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(query).matches,
        () => false,
    );
};

type Props = {
    /** The address being printed. App also passes it as this component's key,
     *  which is what starts a new pass: a new address, a new sheet. */
    pathname: string;
    children: React.ReactNode;
};

const PageTransition: React.FC<Props> = ({ pathname, children }) => {
    const reduced = useReducedMotion() ?? false;
    const compact = useMedia('(max-width: 640px)');
    /* The sheet leaves the DOM the moment it has cleared the screen: no idle
       compositor layer sitting over the page for the rest of the visit. */
    const [printed, setPrinted] = useState(false);

    const press = pressFor(pathname);

    if (reduced) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1, ease: 'linear' }}
            >
                {children}
            </motion.div>
        );
    }

    /* ---- the recipe ----------------------------------------------------- */

    /* The platen holds the last line until the end of its run, so the wire
       sheet is given a shorter one: stepped motion reads as slower than the
       same distance travelled smoothly, and both must land at the same time. */
    const sweep = (compact ? 0.18 : 0.22) * (press === 'wire' ? 0.85 : 1);
    const ink = compact ? 0.12 : 0.15;
    const lift = compact ? 4 : 6;
    const slip = press === 'misprint' ? 4 : 2;

    return (
        <>
            <motion.div
                /* The red plate's slip is a CSS animation on the page's own
                   furniture; this attribute arms it, and it comes off again
                   the moment the sheet has cleared. */
                data-press={printed || press === 'wire' ? undefined : press}
                style={{ '--press-slip': `${slip}px` } as React.CSSProperties}
                initial={{ opacity: 0.6, y: lift, x: press === 'misprint' ? -2 : 0 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{
                    opacity: { duration: ink, ease: 'linear' },
                    y: { duration: sweep, ease: ROLLER },
                    x: { duration: 0.12, ease: [0.2, 0.9, 0.3, 1] },
                }}
            >
                {children}
            </motion.div>

            {!printed && (
                <motion.div
                    aria-hidden="true"
                    data-print="hide"
                    /* z-35 clears the page's own sticky furniture (z-30) and
                       stays under the wire strip, the navbar and the terminal:
                       standing furniture is the same on both pages and must
                       not blink. Fixed, so it needs an untransformed parent -
                       which is why the sheet is a sibling of the page rather
                       than a wrapper around it. */
                    className="pointer-events-none fixed inset-0 z-[35] border-t border-rule-strong bg-paper"
                    style={{ backgroundImage: 'var(--paper-noise)', backgroundSize: '260px 260px' }}
                    initial={{ y: 0 }}
                    animate={{ y: '100%' }}
                    transition={{ duration: sweep, ease: press === 'wire' ? platen : ROLLER }}
                    onAnimationComplete={() => setPrinted(true)}
                >
                    {/* The red plate, trailing the black one at the nip. One
                        ribbon on the wire machine, so it sits this one out. */}
                    {press !== 'wire' && (
                        <span
                            className="absolute right-0 left-0 h-px bg-accent opacity-60"
                            style={{ top: `-${slip}px` }}
                        />
                    )}
                </motion.div>
            )}
        </>
    );
};

export default PageTransition;

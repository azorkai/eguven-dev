import { useEffect } from 'react';
import { useLanguage } from '../i18n/useLanguage';

/* ---------------------------------------------------------------------------
 *  ON THE STAND
 *
 *  Leave the tab and the title changes to say the edition is still on the
 *  stand. Come back and it is the title it was, exactly.
 *
 *  Every site that does this says some version of "come back" or "we miss
 *  you", which is a growth tactic wearing a joke's coat, and it is the reason
 *  the trick has a bad name. This one is not addressed to the reader at all.
 *  It is the line a newsagent would give about the paper: nobody is being
 *  asked to do anything, the edition simply has not gone anywhere.
 *
 *  Mechanics worth keeping straight:
 *
 *    - it is `visibilitychange`, not a timer and not a blur listener, so it
 *      fires once when the tab actually goes away and once when it comes back.
 *      Moving another window over the tab is not leaving.
 *    - the real title is read at the moment of leaving rather than kept in
 *      state, so whatever <DocumentMeta> last set for this route and language
 *      is what comes back, and the two can never argue.
 *    - the effect restores the title on the way out as well. A reader who
 *      switches editions or navigates while the tab is hidden cannot be left
 *      with the newsagent's line stuck in the tab.
 * ------------------------------------------------------------------------- */

const OnTheStand: React.FC = () => {
    const { t } = useLanguage();

    useEffect(() => {
        let real: string | null = null;

        const restore = () => {
            if (real === null) return;
            document.title = real;
            real = null;
        };

        const onVisibility = () => {
            if (document.hidden) {
                if (real !== null) return;
                real = document.title;
                document.title = t.stand.away;
                return;
            }
            restore();
        };

        document.addEventListener('visibilitychange', onVisibility);
        return () => {
            document.removeEventListener('visibilitychange', onVisibility);
            restore();
        };
    }, [t]);

    return null;
};

export default OnTheStand;

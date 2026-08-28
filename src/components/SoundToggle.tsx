import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';
import { useSoundPref } from '../sound';

/* ---------------------------------------------------------------------------
 *  The only switch on screen.
 *
 *  It lives inside the games, not in the navigation bar. A speaker icon in the
 *  chrome would tell every reader the site has sound, which is the opposite of
 *  the point: the noise belongs to the things you opened on purpose, and the
 *  switch belongs next to them. The terminal has the same switch as a typed
 *  command.
 *
 *  The icon carries the state twice over, in shape and in colour, so nobody
 *  wanders around with the sound on without knowing it. The 44px box is a
 *  touch target: the icon inside it is small, and the negative margin keeps
 *  the box from pushing the score line off its own row.
 * ------------------------------------------------------------------------- */

const SoundToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
    const { t } = useLanguage();
    const [on, toggle] = useSoundPref();

    /* Labelled with the action, not the state, the way the edition switch is. */
    const label = on ? t.sound.turnOff : t.sound.turnOn;

    return (
        <button
            type="button"
            onClick={() => toggle()}
            aria-pressed={on}
            aria-label={label}
            title={label}
            className={`-my-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-sm transition-colors ${
                on ? 'text-accent hover:text-ink' : 'text-ink-faint hover:text-ink'
            } ${className}`}
        >
            {on ? <Volume2 size={14} /> : <VolumeX size={14} />}
        </button>
    );
};

export default SoundToggle;

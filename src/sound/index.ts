import { useSyncExternalStore } from 'react';

/* ---------------------------------------------------------------------------
 *  THE NOISE THE MACHINE MAKES
 *
 *  A portfolio that makes a sound nobody asked for is a portfolio that gets
 *  closed. So the rules here are not preferences, they are the feature:
 *
 *    1. OFF until the reader turns it on, and the answer is remembered.
 *    2. Nothing plays before a real gesture. The AudioContext is not even
 *       constructed until the reader has clicked or typed something, which
 *       also happens to be what every browser's autoplay policy demands.
 *    3. Only three places make a noise, all of them opened on purpose: the
 *       terminal, the wire machine on /ai, and the games. Navigation, hover,
 *       scroll, page load, switching editions: silent, always.
 *    4. Quiet. Master gain is 0.1 and nothing here is allowed past it.
 *    5. Nothing plays into a tab nobody is looking at.
 *
 *  Every sound is synthesised. No files to download, nothing to license,
 *  nothing added to the page weight, and a few oscillators sit closer to a
 *  teleprinter than any sample would.
 * ------------------------------------------------------------------------- */

const STORAGE_KEY = 'eg:sound';

/** Master level. Everything below is a fraction of this; nothing exceeds it. */
const GAIN = 0.1;

type Listener = (on: boolean) => void;

const listeners = new Set<Listener>();

const readPref = (): boolean => {
    try {
        return window.localStorage.getItem(STORAGE_KEY) === 'on';
    } catch {
        /* private window, blocked storage: silence is the safe default */
        return false;
    }
};

let enabled = typeof window === 'undefined' ? false : readPref();

/* ---- the gesture gate ---------------------------------------------------
   One listener, removed the moment it fires. Until it has, `audio()` refuses
   to build a context, so a cold load of /ai with sound remembered as on
   still opens in silence rather than fighting the autoplay policy. */

let gestured = false;

if (typeof window !== 'undefined') {
    const arm = () => {
        gestured = true;
    };
    const opts = { once: true, capture: true, passive: true } as const;
    window.addEventListener('pointerdown', arm, opts);
    window.addEventListener('keydown', arm, opts);
    window.addEventListener('touchstart', arm, opts);
}

/* ---- context, built late and once --------------------------------------- */

type ContextCtor = typeof AudioContext;

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

const audio = (): AudioContext | null => {
    if (!enabled || !gestured) return null;
    if (typeof document !== 'undefined' && document.hidden) return null;

    if (!ctx) {
        try {
            const w = window as unknown as { AudioContext?: ContextCtor; webkitAudioContext?: ContextCtor };
            const Ctor = w.AudioContext ?? w.webkitAudioContext;
            if (!Ctor) return null;
            ctx = new Ctor();
        } catch {
            return null;
        }
    }

    if (ctx.state === 'suspended') void ctx.resume().catch(() => {});
    return ctx;
};

/** One second of white noise, reused for every click, hiss and thud. */
const noiseBuffer = (c: AudioContext): AudioBuffer => {
    if (noise && noise.sampleRate === c.sampleRate) return noise;
    const length = Math.floor(c.sampleRate * 0.5);
    const buffer = c.createBuffer(1, length, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
    noise = buffer;
    return buffer;
};

/** Gain envelope: up at `level` immediately, down to nothing over `decay`. */
const envelope = (c: AudioContext, at: number, level: number, decay: number): GainNode => {
    const g = c.createGain();
    g.gain.setValueAtTime(Math.min(level, GAIN * 2), at);
    g.gain.exponentialRampToValueAtTime(0.0001, at + decay);
    return g;
};

/* ---- the sounds ---------------------------------------------------------- */

export const sound = {
    /** Typebar hitting paper. A filtered noise burst, 25 to 40ms, and both the
     *  pitch and the length wander so a run of keys is a machine and not a
     *  machine gun. */
    key(): void {
        const c = audio();
        if (!c) return;
        const t = c.currentTime;
        const decay = 0.022 + Math.random() * 0.016;

        const src = c.createBufferSource();
        src.buffer = noiseBuffer(c);
        src.playbackRate.value = 0.85 + Math.random() * 0.45;

        const band = c.createBiquadFilter();
        band.type = 'bandpass';
        band.frequency.value = 1500 + Math.random() * 1100;
        band.Q.value = 0.9;

        const g = envelope(c, t, GAIN * 0.85, decay);
        src.connect(band).connect(g).connect(c.destination);
        src.start(t);
        src.stop(t + decay + 0.02);
    },

    /** The bell a teleprinter rings at the end of the line. One place only. */
    bell(): void {
        const c = audio();
        if (!c) return;
        const t = c.currentTime;
        const osc = c.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2090, t);
        const g = envelope(c, t, GAIN * 0.5, 0.32);
        osc.connect(g).connect(c.destination);
        osc.start(t);
        osc.stop(t + 0.34);
    },

    /** Snake, on food. A short tick, nothing more. */
    blip(): void {
        const c = audio();
        if (!c) return;
        const t = c.currentTime;
        const osc = c.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, t);
        const g = envelope(c, t, GAIN * 0.7, 0.07);
        osc.connect(g).connect(c.destination);
        osc.start(t);
        osc.stop(t + 0.09);
    },

    /** 2048, on a merge. One rising step, pitched by how big the tile got. */
    rise(value = 4): void {
        const c = audio();
        if (!c) return;
        const t = c.currentTime;
        /* Every doubling lifts the note; capped so 2048 is not a dog whistle. */
        const steps = Math.min(Math.log2(Math.max(value, 4)) - 2, 6);
        const from = 320 * Math.pow(1.12, steps);
        const osc = c.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(from, t);
        osc.frequency.exponentialRampToValueAtTime(from * 1.5, t + 0.11);
        const g = envelope(c, t, GAIN * 0.65, 0.14);
        osc.connect(g).connect(c.destination);
        osc.start(t);
        osc.stop(t + 0.16);
    },

    /** Mines, on a detonation. Low noise, gone quickly. */
    thud(): void {
        const c = audio();
        if (!c) return;
        const t = c.currentTime;

        const src = c.createBufferSource();
        src.buffer = noiseBuffer(c);
        src.playbackRate.value = 0.55;

        const low = c.createBiquadFilter();
        low.type = 'lowpass';
        low.frequency.setValueAtTime(420, t);
        low.frequency.exponentialRampToValueAtTime(90, t + 0.3);

        const g = envelope(c, t, GAIN, 0.34);
        src.connect(low).connect(g).connect(c.destination);
        src.start(t);
        src.stop(t + 0.36);
    },
};

/* ---- the preference ------------------------------------------------------ */

export const isSoundOn = (): boolean => enabled;

export const setSound = (on: boolean): boolean => {
    enabled = on;
    try {
        window.localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
    } catch {
        /* blocked storage: the choice holds for this visit only */
    }
    if (!on && ctx) {
        void ctx.suspend().catch(() => {});
    }
    listeners.forEach((fn) => fn(enabled));
    return enabled;
};

/** Flips the switch and hands back what it now is, for the terminal to print. */
export const toggleSound = (): boolean => setSound(!enabled);

export const subscribeSound = (fn: Listener): (() => void) => {
    listeners.add(fn);
    return () => {
        listeners.delete(fn);
    };
};

/** Read the switch from a component and re-render when anything else flips it,
 *  so the terminal banner and every game button always agree. */
export function useSoundPref(): [boolean, () => boolean] {
    const on = useSyncExternalStore(
        (notify) => subscribeSound(notify),
        isSoundOn,
        () => false,
    );
    return [on, toggleSound];
}

/*
 * The sound and voice of a meeting alert in the browser, as the app plays them
 * (src/services/alerts/feedback.ts in the app), with the app's own sounds:
 * - Maximum: the alarm loops, rising from 40% to the alert volume over 20
 *   seconds; the voice reads the alert after 1.5 seconds and again every 30
 *   seconds, 3 times at most, with the alarm turned down while it speaks.
 * - Medium: one chime, then the voice once.
 * - Light: one chime (the voice only when the user chose voice only).
 * The alert settings choose voice and sound, voice only or sound only, and the
 * volume. Browsers play sound only after a click on the page, so when one is
 * blocked `onBlocked` is called and `retry` plays it after the next click.
 */

import type { AlertIntensity, AlertSoundType } from "./types";

const ALARM_SRC = "/sounds/meeting_alarm.wav";
const CHIME_SRC = "/sounds/meeting_chime.wav";

const RAMP_MS = 20_000;
const RAMP_START = 0.4;
const RAMP_STEP_MS = 1000;
const VOICE_FIRST_DELAY_MS = 1500;
const VOICE_REPEAT_MS = 30_000;
const VOICE_MAX_REPEATS = 3;
const DUCK = 0.25;

export type FeedbackRequest = {
  intensity: AlertIntensity;
  soundType: AlertSoundType;
  /** 0 to 1. */
  volume: number;
  /** The words to read aloud, already in `lang`. */
  voice: string;
  lang: "en" | "es";
};

const clamp = (v: number) => (Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0);
const SPEECH_LANG = { en: "en-US", es: "es-ES" } as const;

function pickVoice(lang: "en" | "es") {
  try {
    const voices = window.speechSynthesis.getVoices();
    return voices.find((v) => v.lang.replace("_", "-") === SPEECH_LANG[lang]) ?? voices.find((v) => v.lang.toLowerCase().startsWith(lang)) ?? null;
  } catch {
    return null;
  }
}

export class AlertFeedback {
  private audio: HTMLAudioElement | null = null;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private ramp: ReturnType<typeof setInterval> | undefined;
  private stopped = false;
  private speaking = false;
  private spoken = 0;
  private level = 0;
  private blocked = false;

  constructor(
    private readonly req: FeedbackRequest,
    private readonly onBlocked: () => void,
  ) {}

  private get wantsSound() {
    return this.req.soundType !== "voice_only" && clamp(this.req.volume) > 0;
  }

  private get wantsVoice() {
    if (this.req.soundType === "sound_only" || !this.req.voice) return false;
    return this.req.intensity !== "light" || this.req.soundType === "voice_only";
  }

  start() {
    if (this.req.intensity === "max") this.startMax();
    else this.startOnce();
  }

  /** Plays again after a click, when the browser blocked it the first time. */
  retry() {
    if (!this.blocked || this.stopped) return;
    this.blocked = false;
    this.clearTimers();
    this.audio?.pause();
    this.audio = null;
    this.spoken = 0;
    this.start();
  }

  stop() {
    this.stopped = true;
    this.clearTimers();
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio = null;
    }
    if (this.speaking) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.speaking = false;
  }

  private clearTimers() {
    for (const t of this.timers) clearTimeout(t);
    this.timers = [];
    clearInterval(this.ramp);
  }

  private later(ms: number, fn: () => void) {
    this.timers.push(setTimeout(() => !this.stopped && fn(), ms));
  }

  private markBlocked() {
    if (this.blocked || this.stopped) return;
    this.blocked = true;
    this.onBlocked();
  }

  private play(src: string, loop: boolean, volume: number, onEnded?: () => void) {
    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = clamp(volume);
    if (onEnded) audio.addEventListener("ended", onEnded, { once: true });
    audio.play().catch((err: unknown) => {
      if (err instanceof DOMException && err.name === "NotAllowedError") this.markBlocked();
    });
    return audio;
  }

  private startMax() {
    const target = clamp(this.req.volume);
    if (this.wantsSound) {
      this.level = target * RAMP_START;
      this.audio = this.play(ALARM_SRC, true, this.level);
      const steps = RAMP_MS / RAMP_STEP_MS;
      let step = 0;
      this.ramp = setInterval(() => {
        step++;
        this.level = target * (RAMP_START + ((1 - RAMP_START) * Math.min(step, steps)) / steps);
        if (this.audio && !this.speaking) this.audio.volume = clamp(this.level);
        if (step >= steps) clearInterval(this.ramp);
      }, RAMP_STEP_MS);
    }
    if (this.wantsVoice) this.later(this.wantsSound ? VOICE_FIRST_DELAY_MS : 0, () => this.speakRepeating());
  }

  private speakRepeating() {
    this.speak(() => {
      if (this.spoken < VOICE_MAX_REPEATS) this.later(VOICE_REPEAT_MS, () => this.speakRepeating());
    });
  }

  private startOnce() {
    const voiceLater = () => {
      if (this.wantsVoice) this.later(this.wantsSound ? VOICE_FIRST_DELAY_MS : 0, () => this.speak());
    };
    if (this.wantsSound) this.audio = this.play(CHIME_SRC, false, clamp(this.req.volume));
    voiceLater();
  }

  private speak(onDone?: () => void) {
    if (this.stopped || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    this.spoken++;
    const u = new SpeechSynthesisUtterance(this.req.voice);
    u.lang = SPEECH_LANG[this.req.lang];
    const voice = pickVoice(this.req.lang);
    if (voice) u.voice = voice;
    u.volume = Math.max(0.6, clamp(this.req.volume));
    const finish = () => {
      if (!this.speaking) return;
      this.speaking = false;
      if (this.audio && this.req.intensity === "max") this.audio.volume = clamp(this.level);
      if (!this.stopped) onDone?.();
    };
    u.onend = finish;
    u.onerror = (e) => {
      if (e.error === "not-allowed") {
        this.speaking = false;
        this.markBlocked();
        return;
      }
      finish();
    };
    this.speaking = true;
    if (this.audio && this.req.intensity === "max") this.audio.volume = clamp(this.level * DUCK);
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {
      finish();
    }
  }
}

export class Timer {
  private readonly durationMs: number;
  private readonly delayDurationMs: number;
  private readonly onEnd: () => void;

  private timeout?: NodeJS.Timeout | null;
  private delayTimeout?: NodeJS.Timeout | null;
  private endAt?: number | null;

  constructor(durationMs: number, onEnd: () => void, delayDurationMs?: number) {
    this.durationMs = durationMs;
    this.onEnd = onEnd;
    this.delayDurationMs = delayDurationMs ?? 0;
  }

  public getEndAt() {
    return this.endAt ? this.endAt : 0;
  }

  public start() {
    if (this.timeout || this.delayTimeout) return;

    this.endAt = Date.now() + this.delayDurationMs + this.durationMs;

    if (this.delayDurationMs === 0) {
      this.startMainTimer();
      return;
    }

    this.delayTimeout = setTimeout(() => {
      this.delayTimeout = null;
      this.startMainTimer();
    }, this.delayDurationMs);
  }

  private startMainTimer() {
    this.timeout = setTimeout(() => {
      this.onEnd();
    }, this.durationMs);
  }

  public reset() {
    this.clear();
    this.start();
  }

  public clear() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout);
      this.delayTimeout = null;
    }

    this.endAt = null;
  }
}

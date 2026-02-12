export class Timer {
  private readonly durationMs: number;
  private readonly onEnd: () => void;

  private timeout?: NodeJS.Timeout | null;
  private endAt?: number | null;

  constructor(durationMs: number, onEnd: () => void) {
    this.durationMs = durationMs;
    this.onEnd = onEnd;
  }

  public getEndAt() {
    return this.endAt ? this.endAt : 0;
  }

  public start() {
    if (this.timeout) return;

    this.endAt = Date.now() + this.durationMs;
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
      this.endAt = null;
    }
  }
}

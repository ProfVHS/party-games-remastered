export class Timer {
  private readonly duration: number;
  private readonly onEnd: () => void;
  private timeout?: NodeJS.Timeout;
  private endAt?: number;

  constructor(duration: number, onEnd: () => void) {
    this.duration = duration;
    this.onEnd = onEnd;
  }

  public getTimeLeft = () => {
    if (this.endAt && this.timeout) {
      return this.endAt - Date.now();
    }
    return 0;
  };

  public start = () => {
    this.endAt = Date.now() + this.duration;
    this.timeout = setTimeout(() => {
      this.onEnd();
    }, this.duration);
  };

  public reset = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.onEnd, this.duration);
    }
  };

  public clear = () => {
    if (this.timeout) {
      this.timeout = setTimeout(this.onEnd, this.duration);
    }
  };
}

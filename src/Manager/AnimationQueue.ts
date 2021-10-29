class AnimationQueue {
  queue: Array<() => Promise<void>> = [];
  available = true;
  private availablePromise!: Promise<void>;

  add(animation: () => Promise<void>): Promise<void> {
    this.queue.push(animation);
    if (this.available) this.createLoop();
    return this.availablePromise;
  }

  private async createLoop(): Promise<void> {
    this.availablePromise = new Promise((resolve) => this.loop(resolve));
  }

  private async loop(resolve: () => void) {
    this.available = false;
    while (this.queue.length !== 0) {
      const animation = this.queue.shift();
      // eslint-disable-next-line no-await-in-loop
      if (animation) await animation();
    }
    this.available = true;
    resolve();
  }
}

export default AnimationQueue;

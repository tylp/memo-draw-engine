class Utils {
  static done: Promise<void> = new Promise(() => {});

  static async waitInterval(waitingIntervalMs: number): Promise<void> {
    if (waitingIntervalMs !== 0) {
      await new Promise((resolve) => setTimeout(resolve, waitingIntervalMs));
    }
  }

  static round(number: number): number {
    return Math.round((number + Number.EPSILON) * 100) / 100;
  }
}

export default Utils;

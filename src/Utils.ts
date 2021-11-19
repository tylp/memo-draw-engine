/* eslint-disable no-bitwise */
class Utils {
  static done: Promise<void> = new Promise(() => {});

  static round(number: number): number {
    return Math.round((number + Number.EPSILON) * 100) / 100;
  }

  // Generate short id without collision checking
  // Shouuld be ok for < 1K  collection
  // No need for secure id (crypto)
  static generateUID(): string {
    const firstPart = (`000${((Math.random() * 46656) | 0).toString(36)}`).slice(-3);
    const secondPart = (`000${((Math.random() * 46656) | 0).toString(36)}`).slice(-3);
    return firstPart + secondPart;
  }
}

export default Utils;

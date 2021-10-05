import Color from './Color';

class AlphaColor extends Color {
  alpha: number;

  constructor(red: number, green: number, blue: number, alpha: number) {
    super(red, green, blue);
    this.alpha = alpha;
  }

  toRgba(): string {
    return `rgba(${this.red},${this.green},${this.blue},${this.alpha / 255})`;
  }

  equal(color: AlphaColor): boolean {
    return color.red === this.red
      && color.green === this.green
      && color.blue === this.blue
      && color.alpha === this.alpha;
  }
}

export default AlphaColor;

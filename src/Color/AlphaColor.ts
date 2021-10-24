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

  add(newColor: AlphaColor): AlphaColor {
    const oldColorAlpha = this.alpha / 255;
    const newColorAlpha = newColor.alpha / 255;
    const newAlpha = 1 - (1 - newColorAlpha) * (1 - oldColorAlpha);

    return new AlphaColor(
      Math.round(((newColor.red * newColorAlpha) / newAlpha) + (((this.red * oldColorAlpha) * (1 - newColorAlpha)) / newAlpha)),
      Math.round(((newColor.green * newColorAlpha) / newAlpha) + (((this.green * oldColorAlpha) * (1 - newColorAlpha)) / newAlpha)),
      Math.round(((newColor.blue * newColorAlpha) / newAlpha) + (((this.blue * oldColorAlpha) * (1 - newColorAlpha)) / newAlpha)),
      newAlpha * 255,
    );
  }
}

export default AlphaColor;

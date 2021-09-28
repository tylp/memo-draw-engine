import Color from './Color';

class AlphaColor extends Color {
  alpha : number;

  constructor(red: number, green: number, blue: number, alpha: number) {
    super(red, green, blue);
    this.alpha = alpha;
  }

  toRgba() : string {
    return `rgba(${this.red},${this.green},${this.blue},${this.alpha / 255})`;
  }

  equal(color : AlphaColor) : boolean {
    return color.red === this.red
      && color.green === this.green
      && color.blue === this.blue
      && color.alpha === this.alpha;
  }

  static getAlphaColorFromColor(color : Color, opacity : number) : AlphaColor {
    return new AlphaColor(
      color.red,
      color.green,
      color.blue,
      opacity * 255,
    );
  }
}

export default AlphaColor;

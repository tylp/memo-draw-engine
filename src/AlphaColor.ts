import Color from './Color';
import Utils from './Utils';

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

  hueLightEqual(color : AlphaColor) : boolean {
    const hl1 = this.getHueLight();
    const hl2 = color.getHueLight();
    return hl1[0] === hl2[0] && hl1[1] === hl2[1];
  }

  getHueLight() : Array<number> {
    const opacity = this.alpha / 255;

    const red = ((1 - opacity) * 255 + opacity * this.red) / 255;
    const green = ((1 - opacity) * 255 + opacity * this.green) / 255;
    const blue = ((1 - opacity) * 255 + opacity * this.blue) / 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);

    const light = (max + min) / 2;
    let hue = light;

    if (max === min) {
      hue = 0;
    } else {
      const d = max - min;
      // eslint-disable-next-line default-case
      switch (max) {
        case red: hue = (green - blue) / d + (green < blue ? 6 : 0); break;
        case green: hue = (blue - red) / d + 2; break;
        case blue: hue = (red - green) / d + 4; break;
      }
      hue /= 6;
    }

    return [Utils.round(hue), Utils.round(light)];
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

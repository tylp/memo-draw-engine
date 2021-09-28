import Utils from '../Utils';
import AlphaColor from './AlphaColor';

class HueLight {
  hue: number;
  light: number;

  constructor(alphacolor: AlphaColor) {
    const opacity = alphacolor.alpha / 255;

    const red = ((1 - opacity) * 255 + opacity * alphacolor.red) / 255;
    const green = ((1 - opacity) * 255 + opacity * alphacolor.green) / 255;
    const blue = ((1 - opacity) * 255 + opacity * alphacolor.blue) / 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);

    this.light = (max + min) / 2;
    this.hue = this.light;

    if (max === min) {
      this.hue = 0;
    } else {
      const d = max - min;
      // eslint-disable-next-line default-case
      switch (max) {
        case red: this.hue = (green - blue) / d + (green < blue ? 6 : 0); break;
        case green: this.hue = (blue - red) / d + 2; break;
        case blue: this.hue = (red - green) / d + 4; break;
      }
      this.hue /= 6;
    }

    this.light = Utils.round(this.light);
    this.hue = Utils.round(this.hue);
  }

  equal(hueLigt: HueLight) : boolean {
    return this.hue === hueLigt.hue && this.light === hueLigt.light;
  }

  static alphaColorEqual(c1 : AlphaColor, c2: AlphaColor) : boolean {
    const hueLight1 = new HueLight(c1);
    const hueLight2 = new HueLight(c2);
    return hueLight1.equal(hueLight2);
  }
}

export default HueLight;

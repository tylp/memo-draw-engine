class Color {
  red: number;
  green: number;
  blue: number;

  constructor(red: number, green: number, blue: number) {
    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  toRgb(): string {
    return `rgb(${this.red}, ${this.green}, ${this.blue})`;
  }
}

export default Color;

import canvas from '../Canvas';
import AlphaColor from '../Color/AlphaColor';
import type ShapeManager from '../Manager/ShapeManager';

class Shape {
  color : AlphaColor;
  thickness : number;

  constructor(color : AlphaColor, thickness : number) {
    this.color = color;
    this.thickness = thickness;
  }

  // Export information that will be emit
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exportInfo() : any {
    return { color: this.color, thickness: this.thickness };
  }
  // Use to definitely draw shape (viewer side)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  draw(shapeManager : ShapeManager) : Promise<void> {
    canvas.setStyle(this.color, this.thickness);
    return Promise.resolve();
  }
}

export default Shape;

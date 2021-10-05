import ShapeType from './ShapeType';
import canvas from '../Canvas';
import AlphaColor from '../Color/AlphaColor';
import type ShapeManager from '../Manager/ShapeManager';
import IShapeInfo from './IShapeInfo';

abstract class Shape {
  protected abstract shapeType: ShapeType;
  color: AlphaColor;
  thickness: number;

  constructor(color: AlphaColor, thickness: number) {
    this.color = color;
    this.thickness = thickness;
  }

  getType(): ShapeType {
    return this.shapeType;
  }

  serialize(): IShapeInfo {
    return { type: this.getType(), parameters: this.getExportInfo() };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected getExportInfo(): any {
    return { color: this.color, thickness: this.thickness };
  }

  // Use to definitely draw shape (viewer side)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  draw(shapeManager: ShapeManager): Promise<void> {
    canvas.setStyle(this.color, this.thickness);
    return Promise.resolve();
  }
}

export default Shape;

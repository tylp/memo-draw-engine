import Utils from '../Utils';
import ShapeType from './ShapeType';
import AlphaColor from '../Color/AlphaColor';
import IShapeInfo from './IShapeInfo';
import Canvas from '../Canvas';

abstract class Shape {
  protected abstract shapeType: ShapeType;
  id: string;
  color: AlphaColor;
  thickness: number;
  created: boolean;

  constructor(id: string | undefined, color: AlphaColor, thickness: number) {
    this.id = id || Utils.generateUID();
    this.created = (id === undefined);
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
    return { color: this.color, thickness: this.thickness, id: this.id };
  }

  // Use to definitely draw shape (viewer side)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  abstract draw(canvas: Canvas, animate: boolean): Promise<void>;
}

export default Shape;

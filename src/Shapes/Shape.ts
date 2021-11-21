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

  public getType(): ShapeType {
    return this.shapeType;
  }

  public serialize(): IShapeInfo {
    return { type: this.getType(), parameters: this.getExportInfo() };
  }

  // Use to definitely draw shape (viewer side)
  public abstract draw(canvas: Canvas): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected getExportInfo(): any {
    return { color: this.color, thickness: this.thickness, id: this.id };
  }
}

export default Shape;

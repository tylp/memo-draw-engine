import Shape from './Shape';
import type ShapeManager from '../Manager/ShapeManager';
import Point from '../Point';
import type AlphaColor from '../Color/AlphaColor';

abstract class UpdatableShape extends Shape {
  startDate: number | undefined;
  endDate: number | undefined;

  constructor(color: AlphaColor, thickness: number) {
    super(color, thickness);
    this.startDate = Date.now();
  }

  get durationMs() { 
    if (this.endDate === undefined || this.startDate === undefined) return 0;
    return this.endDate - this.startDate
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected getExportInfo(): any {
    return {
      ...super.getExportInfo(),
      startDate: this.startDate,
      endDate: this.endDate,
    };
  }

  // Use for live view of shape (drawer side)
  abstract update(point: Point, shapeManager: ShapeManager): void;
}

export default UpdatableShape;

import Shape from './Shape';
import Point from '../Point';
import type AlphaColor from '../Color/AlphaColor';
import Canvas from '../Canvas';

abstract class UpdatableShape extends Shape {
  startDate: number | undefined;
  endDate: number | undefined;

  constructor(color: AlphaColor, thickness: number) {
    super(color, thickness);
    this.startDate = Date.now();
  }

  get durationMs(): number {
    if (this.endDate === undefined || this.startDate === undefined) return 0;
    return this.endDate - this.startDate;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected getExportInfo(): any {
    return {
      ...super.getExportInfo(),
      startDate: this.startDate,
      endDate: this.endDate,
    };
  }

  // Use for live view of shape (drawer side)
  abstract update(point: Point, canvas: Canvas): void;
}

export default UpdatableShape;

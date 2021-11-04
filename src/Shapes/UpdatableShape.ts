import Shape from './Shape';
import Point from '../Point';
import type AlphaColor from '../Color/AlphaColor';
import Canvas from '../Canvas';

abstract class UpdatableShape extends Shape {
  startDate: number | undefined;
  endDate: number | undefined;

  constructor(id: string, color: AlphaColor, thickness: number) {
    super(id, color, thickness);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async draw(canvas: Canvas, animate: boolean): Promise<void> {
    canvas.setStyle(this.color, this.thickness);
    return Promise.resolve();
  }
}

export default UpdatableShape;

import type AnimationManager from '../Manager/AnimationManager';
import Shape from './Shape';
import Point from '../Point';
import type AlphaColor from '../Color/AlphaColor';
import Canvas from '../Canvas';

abstract class UpdatableShape extends Shape {
  startDate: number | undefined;
  endDate: number | undefined;

  constructor(id: string | undefined, color: AlphaColor, thickness: number) {
    super(id, color, thickness);
    this.startDate = Date.now();
  }

  get durationMs(): number {
    if (this.endDate === undefined || this.startDate === undefined) return 0;
    return this.endDate - this.startDate;
  }

  // Base implementation for draw
  public draw(canvas: Canvas): void {
    canvas.setStyle(this.color, this.thickness);
  }

  // Animate of draw (viewer side)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async animate(canvas: Canvas, animationManager: AnimationManager): Promise<void> {
    canvas.setStyle(this.color, this.thickness);
    return Promise.resolve();
  }

  // Use for live view of shape (drawer side)
  public abstract update(point: Point, canvas: Canvas): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected getExportInfo(): any {
    return {
      ...super.getExportInfo(),
      startDate: this.startDate,
      endDate: this.endDate,
    };
  }
}

export default UpdatableShape;

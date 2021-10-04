import Shape from './Shape';
import type ShapeManager from '../Manager/ShapeManager';
import Point from '../Point';

abstract class UpdatableShape extends Shape {
  startDate: number | undefined;
  endDate: number | undefined;

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

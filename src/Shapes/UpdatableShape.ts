import Shape from './Shape';
import type { ShapeManager } from '../Manager/ShapeManager';

abstract class UpdatableShape extends Shape {
  startDate: number | undefined;
  endDate: number | undefined;

  // Use for live view of shape (drawer side)
  abstract update(event : MouseEvent, shapeManager : ShapeManager) : void;
}

export default UpdatableShape;

import Shape from './Shape';
import type { ShapeManager } from '../ShapeManager';

abstract class UpdatableShape extends Shape {
  // Use for live view of shape (drawer side)
  abstract update(event : MouseEvent, shapeManager : ShapeManager) : void;
}

export default UpdatableShape;

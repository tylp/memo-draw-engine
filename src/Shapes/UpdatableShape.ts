import Shape from './Shape';
import type ShapeManager from '../Manager/ShapeManager';
import Point from '../Point';

abstract class UpdatableShape extends Shape {
  startDate: number | undefined;
  endDate: number | undefined;

  // Use for live view of shape (drawer side)
  abstract update(point : Point, shapeManager : ShapeManager) : void;
}

export default UpdatableShape;

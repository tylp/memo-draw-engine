import type { ShapeManager } from '../ShapeManager';

abstract class Shape {
  // Use to definitely draw shape (viewer side)
  abstract draw(durationMs : number, shapeManager : ShapeManager) : Promise<void>;
}

export default Shape;

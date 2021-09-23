import type { ShapeManager } from '../Manager/ShapeManager';

abstract class Shape {
  // Use to definitely draw shape (viewer side)
  abstract draw(shapeManager : ShapeManager) : Promise<void>;
}

export default Shape;

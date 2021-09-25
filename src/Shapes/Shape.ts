import type { ShapeManager } from '../Manager/ShapeManager';

abstract class Shape {
  // Export information that will be emit
  abstract exportInfo() : unknown;
  // Use to definitely draw shape (viewer side)
  abstract draw(shapeManager : ShapeManager) : Promise<void>;
}

export default Shape;

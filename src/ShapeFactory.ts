import ShapeType from './ShapeType';
import type Shape from './Shapes/Shape';
import Draw from './Shapes/Draw';
import RectangleFull from './Shapes/RectangleFull';
import RectangleStroke from './Shapes/RectangleStroke';
import EllipseFull from './Shapes/EllipseFull';
import EllipseStroke from './Shapes/EllipseStroke';
import Line from './Shapes/Line';
import Fill from './Shapes/Fill';

class ShapeFactory {
  static create(shapeType : ShapeType) : Shape {
    switch (shapeType) {
      case ShapeType.Draw:
        return new Draw();
      case ShapeType.RectangleFull:
        return new RectangleFull();
      case ShapeType.RectangleStroke:
        return new RectangleStroke();
      case ShapeType.EllipseFull:
        return new EllipseFull();
      case ShapeType.EllipseStroke:
        return new EllipseStroke();
      case ShapeType.Line:
        return new Line();
      case ShapeType.Fill:
        return new Fill();
      default:
        throw new Error('Shape is not implemented');
    }
  }
}

export default ShapeFactory;

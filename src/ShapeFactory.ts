import ShapeType from './ShapeType';
import type Shape from './Shape';
import Draw from './Draw';

class ShapeFactory {
  static create(shapeType : ShapeType) : Shape {
    switch (shapeType) {
      case ShapeType.Draw:
        return new Draw();
      default:
        throw new Error('Shape is not implemented');
    }
  }
}

export default ShapeFactory;

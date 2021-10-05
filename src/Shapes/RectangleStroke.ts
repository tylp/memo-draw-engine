import Point from '../Point';
import DraggableShape from './DraggableShape';
import canvas from '../Canvas';
import ShapeType from './ShapeType';

class RectangleStroke extends DraggableShape {
  protected shapeType: ShapeType = ShapeType.RectangleStroke;

  protected drawShape(originPoint: Point, width: number, height: number): void {
    canvas.ctx.strokeRect(originPoint.x, originPoint.y, width, height);
  }
}

export default RectangleStroke;

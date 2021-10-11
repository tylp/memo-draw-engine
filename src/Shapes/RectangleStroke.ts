import Canvas from '../Canvas';
import Point from '../Point';
import DraggableShape from './DraggableShape';
import ShapeType from './ShapeType';

class RectangleStroke extends DraggableShape {
  protected shapeType: ShapeType = ShapeType.RectangleStroke;

  protected drawShape(originPoint: Point, width: number, height: number, canvas: Canvas): void {
    canvas.ctx.strokeRect(originPoint.x, originPoint.y, width, height);
  }
}

export default RectangleStroke;

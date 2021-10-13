import Canvas from '../Canvas';
import Point from '../Point';
import DraggableShape from './DraggableShape';
import ShapeType from './ShapeType';

class RectangleFull extends DraggableShape {
  protected shapeType: ShapeType = ShapeType.RectangleFull;

  protected drawShape(originPoint: Point, width: number, height: number, canvas: Canvas): void {
    canvas.ctx.fillRect(originPoint.x, originPoint.y, width, height);
  }
}

export default RectangleFull;

import CanvasHolder from '../Manager/CanvasHolder';
import Point from '../Point';
import DraggableShape from './DraggableShape';
import ShapeType from './ShapeType';

class RectangleStroke extends DraggableShape {
  protected shapeType: ShapeType = ShapeType.RectangleStroke;

  protected drawShape(originPoint: Point, width: number, height: number, shapeManager: CanvasHolder): void {
    shapeManager.canvas.ctx.strokeRect(originPoint.x, originPoint.y, width, height);
  }
}

export default RectangleStroke;

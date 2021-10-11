import CanvasHolder from '../Manager/CanvasHolder';
import Point from '../Point';
import DraggableShape from './DraggableShape';
import ShapeType from './ShapeType';

class RectangleFull extends DraggableShape {
  protected shapeType: ShapeType = ShapeType.RectangleFull;

  protected drawShape(originPoint: Point, width: number, height: number, shapeManager: CanvasHolder): void {
    shapeManager.canvas.ctx.fillRect(originPoint.x, originPoint.y, width, height);
  }
}

export default RectangleFull;

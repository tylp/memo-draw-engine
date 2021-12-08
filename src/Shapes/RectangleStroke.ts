import Canvas from '../Canvas';
import Point from '../Point';
import DraggableShape from './DraggableShape';
import ShapeType from './ShapeType';

class RectangleStroke extends DraggableShape {
  protected shapeType: ShapeType = ShapeType.RectangleStroke;

  protected drawShape(originPoint: Point, width: number, height: number, canvas: Canvas): void {
    const realOriginPoint = canvas.getAbsolutePoint(originPoint);
    const realHeigt = canvas.getAbsoluteHeight(height);
    const realWidth = canvas.getAbsoluteWidth(width);

    canvas.ctx.strokeRect(realOriginPoint.x, realOriginPoint.y, realWidth, realHeigt);
  }
}

export default RectangleStroke;

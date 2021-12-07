import Canvas from '../Canvas';
import type Point from '../Point';
import DraggableShape from './DraggableShape';
import ShapeType from './ShapeType';

class Line extends DraggableShape {
  protected shapeType: ShapeType = ShapeType.Line;

  protected drawShape(originPoint: Point, width: number, height: number, canvas: Canvas): void {
    const realOriginPoint = canvas.getAbsolutePoint(originPoint);
    const realHeigt = canvas.getAbsoluteHeight(height);
    const realWidth = canvas.getAbsoluteWidth(width);

    canvas.ctx.beginPath();
    canvas.ctx.moveTo(realOriginPoint.x, realOriginPoint.y);
    canvas.ctx.lineTo(realOriginPoint.x + realWidth, realOriginPoint.y + realHeigt);
    canvas.ctx.stroke();
    canvas.ctx.closePath();
  }
}

export default Line;

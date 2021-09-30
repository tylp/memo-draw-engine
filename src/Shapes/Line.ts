import type Point from 'Point';
import DraggableShape from './DraggableShape';
import canvas from '../Canvas';
import ShapeType from './ShapeType';

class Line extends DraggableShape {
  protected shapeType: ShapeType = ShapeType.Line;

  protected drawShape(originPoint: Point, width: number, height: number): void {
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(originPoint.x, originPoint.y);
    canvas.ctx.lineTo(originPoint.x + width, originPoint.y + height);
    canvas.ctx.stroke();
    canvas.ctx.closePath();
  }
}

export default Line;

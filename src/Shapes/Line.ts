import CanvasHolder from '../Manager/CanvasHolder';
import type Point from '../Point';
import DraggableShape from './DraggableShape';
import ShapeType from './ShapeType';

class Line extends DraggableShape {
  protected shapeType: ShapeType = ShapeType.Line;

  protected drawShape(originPoint: Point, width: number, height: number, shapeManager: CanvasHolder): void {
    shapeManager.canvas.ctx.beginPath();
    shapeManager.canvas.ctx.moveTo(originPoint.x, originPoint.y);
    shapeManager.canvas.ctx.lineTo(originPoint.x + width, originPoint.y + height);
    shapeManager.canvas.ctx.stroke();
    shapeManager.canvas.ctx.closePath();
  }
}

export default Line;

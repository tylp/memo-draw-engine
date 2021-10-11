import Canvas from '../Canvas';
import Point from '../Point';
import DraggableShape from './DraggableShape';

abstract class Ellipse extends DraggableShape {
  protected drawShape(originPoint: Point, width: number, height: number, canvas: Canvas): void {
    const x = originPoint.x + (width / 2);
    const y = originPoint.y + (height / 2);
    canvas.ctx.beginPath();
    canvas.ctx.ellipse(x, y, Math.abs(width / 2), Math.abs(height / 2), 0, 0, 2 * Math.PI);
    this.endPath(canvas);
  }

  protected abstract endPath(canvas: Canvas): void;
}

export default Ellipse;

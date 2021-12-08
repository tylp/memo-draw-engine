import Canvas from '../Canvas';
import Point from '../Point';
import DraggableShape from './DraggableShape';

abstract class Ellipse extends DraggableShape {
  protected drawShape(originPoint: Point, width: number, height: number, canvas: Canvas): void {
    const realOriginPoint = canvas.getAbsolutePoint(originPoint);
    const realHeigt = canvas.getAbsoluteHeight(height);
    const realWidth = canvas.getAbsoluteWidth(width);

    const x = realOriginPoint.x + (realWidth / 2);
    const y = realOriginPoint.y + (realHeigt / 2);
    canvas.ctx.beginPath();
    canvas.ctx.ellipse(x, y, Math.abs(realWidth / 2), Math.abs(realHeigt / 2), 0, 0, 2 * Math.PI);
    this.endPath(canvas);
  }

  protected abstract endPath(canvas: Canvas): void;
}

export default Ellipse;

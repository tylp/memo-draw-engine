import CanvasHolder from '../Manager/CanvasHolder';
import Point from '../Point';
import DraggableShape from './DraggableShape';

abstract class Ellipse extends DraggableShape {
  protected drawShape(originPoint: Point, width: number, height: number, shapeManager: CanvasHolder): void {
    const x = originPoint.x + (width / 2);
    const y = originPoint.y + (height / 2);
    shapeManager.canvas.ctx.beginPath();
    shapeManager.canvas.ctx.ellipse(x, y, Math.abs(width / 2), Math.abs(height / 2), 0, 0, 2 * Math.PI);
    this.endPath(shapeManager);
  }

  protected abstract endPath(shapeManager: CanvasHolder): void;
}

export default Ellipse;

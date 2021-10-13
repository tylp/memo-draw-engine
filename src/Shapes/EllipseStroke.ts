import ShapeType from './ShapeType';
import Ellipse from './Ellipse';
import Canvas from '../Canvas';

class EllipseStroke extends Ellipse {
  protected shapeType: ShapeType = ShapeType.EllipseStroke;

  protected endPath(canvas: Canvas): void {
    canvas.ctx.stroke();
  }
}

export default EllipseStroke;

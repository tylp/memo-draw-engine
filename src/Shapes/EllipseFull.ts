import ShapeType from './ShapeType';
import Ellipse from './Ellipse';
import Canvas from '../Canvas';

class EllipseFull extends Ellipse {
  protected shapeType: ShapeType = ShapeType.EllipseFull;

  protected endPath(canvas: Canvas): void {
    canvas.ctx.fill();
  }
}

export default EllipseFull;

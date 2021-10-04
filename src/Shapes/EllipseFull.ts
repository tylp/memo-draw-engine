import ShapeType from './ShapeType';
import canvas from '../Canvas';
import Ellipse from './Ellipse';

class EllipseFull extends Ellipse {
  protected shapeType: ShapeType = ShapeType.EllipseFull;

  protected endPath(): void {
    canvas.ctx.fill();
  }
}

export default EllipseFull;

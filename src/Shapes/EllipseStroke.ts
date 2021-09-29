import ShapeType from './ShapeType';
import canvas from '../Canvas';
import Ellipse from './Ellipse';

class EllipseStroke extends Ellipse {
  protected shapeType: ShapeType = ShapeType.EllipseStroke;

  protected endPath() : void {
    canvas.ctx.stroke();
  }
}

export default EllipseStroke;

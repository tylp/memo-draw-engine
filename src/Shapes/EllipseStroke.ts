import canvas from '../Canvas';
import Ellipse from './Ellipse';

class EllipseStroke extends Ellipse {
  protected endPath() : void {
    canvas.ctx.stroke();
  }
}

export default EllipseStroke;

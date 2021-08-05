import canvas from '../Canvas';
import Ellipse from './Ellipse';

class EllipseFull extends Ellipse {
  protected endPath() : void {
    canvas.ctx.fill();
  }
}

export default EllipseFull;

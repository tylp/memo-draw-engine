import CanvasHolder from '../Manager/CanvasHolder';
import ShapeType from './ShapeType';
import Ellipse from './Ellipse';

class EllipseStroke extends Ellipse {
  protected shapeType: ShapeType = ShapeType.EllipseStroke;

  protected endPath(shapeManager: CanvasHolder): void {
    shapeManager.canvas.ctx.stroke();
  }
}

export default EllipseStroke;

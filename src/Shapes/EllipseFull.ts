import ShapeType from './ShapeType';
import Ellipse from './Ellipse';
import CanvasHolder from '../Manager/CanvasHolder';

class EllipseFull extends Ellipse {
  protected shapeType: ShapeType = ShapeType.EllipseFull;

  protected endPath(shapeManager: CanvasHolder): void {
    shapeManager.canvas.ctx.fill();
  }
}

export default EllipseFull;

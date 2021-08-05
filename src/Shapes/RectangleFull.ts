import Point from '../Point';
import DraggableShape from './DraggableShape';
import canvas from '../Canvas';

class RectangleFull extends DraggableShape {
  protected drawShape(originPoint : Point, width : number, height : number) : void {
    canvas.ctx.fillRect(originPoint.x, originPoint.y, width, height);
  }
}

export default RectangleFull;

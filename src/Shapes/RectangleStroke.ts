import Point from '../Point';
import DraggableShape from './DraggableShape';
import canvas from '../Canvas';

class RectangleStroke extends DraggableShape {
  protected drawShape(originPoint : Point, width : number, height : number) : void {
    canvas.ctx.strokeRect(originPoint.x, originPoint.y, width, height);
  }
}

export default RectangleStroke;

import type { ShapeManager } from '../ShapeManager';
import Shape from './Shape';
import Point from '../Point';
import canvas from '../Canvas';

abstract class DraggableShape extends Shape {
  originPoint : Point | null;
  width : number;
  height : number;

  constructor(originPoint : Point | null = null, width = 0, height = 0) {
    super();
    this.originPoint = originPoint;
    this.width = width;
    this.height = height;
  }

  draw(): void {
    this.prepareAndDrawShape();
  }

  update(event: MouseEvent, shapeManager : ShapeManager): void {
    if (this.originPoint === null) {
      this.originPoint = new Point(event.clientX, event.clientY);
    } else {
      this.clearAndRedrawShapes(shapeManager);
    }

    this.width = event.clientX - this.originPoint.x;
    this.height = event.clientY - this.originPoint.y;

    this.prepareAndDrawShape();
  }

  protected clearAndRedrawShapes(shapeManager : ShapeManager): void {
    canvas.clearCanvas();
    shapeManager.redrawShapes();
  }

  protected prepareAndDrawShape() : void {
    if (this.originPoint !== null) {
      this.setColorAndThickness(canvas.ctx);
      this.drawShape(this.originPoint, this.width, this.height);
    }
  }

  protected abstract drawShape(originPoint : Point, width : number, height : number) : void;
}

export default DraggableShape;

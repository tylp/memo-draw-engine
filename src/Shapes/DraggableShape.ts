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

  async draw(durationMs : number, shapeManager : ShapeManager) : Promise<void> {
    if (this.originPoint === null) return;
    if (durationMs === 0) {
      this.setColorAndThickness(canvas.ctx);
      this.drawShape(this.originPoint, this.width, this.height);
    } else {
      await this.drawWithAnimation(durationMs, shapeManager);
    }
  }

  async drawWithAnimation(durationMs : number, shapeManager : ShapeManager) : Promise<void> {
    const numberOfFrame = (durationMs / 1000) * 60;
    const waitingIntervalMs = durationMs / numberOfFrame;

    for (let i = 1; i <= numberOfFrame; i += 1) {
      const doneIndex = i / numberOfFrame;
      this.clearAndRedrawShapes(shapeManager);
      this.drawShape(this.originPoint as Point, this.width * doneIndex, this.height * doneIndex);
      // Doesnt await if shape is completely drawn
      if (i !== numberOfFrame) {
        // eslint-disable-next-line no-await-in-loop
        await this.waitInterval(waitingIntervalMs);
      }
    }
  }

  update(event: MouseEvent, shapeManager : ShapeManager): void {
    // Origin point is null if it is the first update
    if (this.originPoint === null) {
      this.originPoint = new Point(event.clientX, event.clientY);
      this.setColorAndThickness(canvas.ctx);
    } else {
      // Clear the last update
      this.clearAndRedrawShapes(shapeManager);
    }

    this.width = event.clientX - this.originPoint.x;
    this.height = event.clientY - this.originPoint.y;

    this.drawShape(this.originPoint, this.width, this.height);
  }

  protected clearAndRedrawShapes(shapeManager : ShapeManager): void {
    canvas.clearCanvas(this.color);
    shapeManager.redrawShapes();
  }

  protected abstract drawShape(originPoint : Point, width : number, height : number) : void;
}

export default DraggableShape;

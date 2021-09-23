import Point from '../Point';
import canvas from '../Canvas';
import Utils from '../Utils';
import UpdatableShape from './UpdatableShape';
import type { ShapeManager } from '../Manager/ShapeManager';

abstract class DraggableShape extends UpdatableShape {
  originPoint : Point | null;
  width : number;
  height : number;

  constructor(originPoint : Point | null = null, width = 0, height = 0) {
    super();
    this.originPoint = originPoint;
    this.width = width;
    this.height = height;
  }

  async draw(shapeManager : ShapeManager) : Promise<void> {
    if (this.originPoint === null) return;
    if (!this.endDate || !this.startDate) {
      this.drawShape(this.originPoint, this.width, this.height);
    } else {
      const durationMs = this.endDate - this.startDate;
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
        await Utils.waitInterval(waitingIntervalMs);
      }
    }
  }

  update(event: MouseEvent, shapeManager : ShapeManager): void {
    // Origin point is null if it is the first update
    if (this.originPoint === null) {
      this.originPoint = new Point(event.clientX, event.clientY);
    } else {
      // Clear the last update
      this.clearAndRedrawShapes(shapeManager);
    }

    this.width = event.clientX - this.originPoint.x;
    this.height = event.clientY - this.originPoint.y;

    this.drawShape(this.originPoint, this.width, this.height);
  }

  protected clearAndRedrawShapes(shapeManager : ShapeManager): void {
    canvas.clearCanvas();
    shapeManager.redrawShapes();
  }

  protected abstract drawShape(originPoint : Point, width : number, height : number) : void;
}

export default DraggableShape;

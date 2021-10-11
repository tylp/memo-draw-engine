import Point from '../Point';
import Utils from '../Utils';
import UpdatableShape from './UpdatableShape';
import type ShapeManager from '../Manager/ShapeManager';

abstract class DraggableShape extends UpdatableShape {
  originPoint: Point | null = null;
  width = 0;
  height = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected getExportInfo(): any {
    return {
      ...super.getExportInfo(),
      originPoint: this.originPoint,
      width: this.width,
      height: this.height,
    };
  }

  async draw(shapeManager: ShapeManager): Promise<void> {
    super.draw(shapeManager);
    if (this.originPoint === null) return;
    if (!this.endDate || !this.startDate) {
      this.drawShape(this.originPoint, this.width, this.height, shapeManager);
    } else {
      const durationMs = this.endDate - this.startDate;
      await this.drawWithAnimation(durationMs, shapeManager);
    }
  }

  async drawWithAnimation(durationMs: number, shapeManager: ShapeManager): Promise<void> {
    const numberOfFrame = (durationMs / 1000) * 60;
    const waitingIntervalMs = durationMs / numberOfFrame;

    for (let i = 1; i <= numberOfFrame; i += 1) {
      const doneIndex = i / numberOfFrame;
      this.clearAndRedrawShapes(shapeManager);
      this.drawShape(this.originPoint as Point, this.width * doneIndex, this.height * doneIndex, shapeManager);
      // Doesnt await if shape is completely drawn
      if (i !== numberOfFrame) {
        // eslint-disable-next-line no-await-in-loop
        await Utils.waitInterval(waitingIntervalMs);
      }
    }
  }

  update(point: Point, shapeManager: ShapeManager): void {
    // Origin point is null if it is the first update
    if (this.originPoint === null) {
      this.originPoint = point;
    } else {
      // Clear the last update
      this.clearAndRedrawShapes(shapeManager);
    }

    this.width = point.x - this.originPoint.x;
    this.height = point.y - this.originPoint.y;

    shapeManager.canvas.setStyle(this.color, this.thickness);
    this.drawShape(this.originPoint, this.width, this.height, shapeManager);
  }

  protected clearAndRedrawShapes(shapeManager: ShapeManager): void {
    shapeManager.canvas.clearCanvas();
    shapeManager.redrawShapes();
  }

  protected abstract drawShape(originPoint: Point, width: number, height: number, shapeManager: ShapeManager): void;
}

export default DraggableShape;

import Canvas from '../Canvas';
import Point from '../Point';
import Utils from '../Utils';
import UpdatableShape from './UpdatableShape';

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

  async draw(canvas: Canvas, animate: boolean): Promise<void> {
    super.draw(canvas, animate);
    if (this.originPoint === null) return;
    if (animate) {
      await this.drawWithAnimation(canvas);
    } else {
      this.drawShape(this.originPoint, this.width, this.height, canvas);
    }
  }

  async drawWithAnimation(canvas: Canvas): Promise<void> {
    const numberOfFrame = (this.durationMs / 1000) * 60;
    const waitingIntervalMs = this.durationMs / numberOfFrame;

    for (let i = 1; i <= numberOfFrame; i += 1) {
      const doneIndex = i / numberOfFrame;
      canvas.restoreLast();
      this.drawShape(this.originPoint as Point, this.width * doneIndex, this.height * doneIndex, canvas);
      // Doesnt await if shape is completely drawn
      if (i !== numberOfFrame) {
        // eslint-disable-next-line no-await-in-loop
        await Utils.waitInterval(waitingIntervalMs);
      }
    }
  }

  update(point: Point, canvas: Canvas): void {
    // Origin point is null if it is the first update
    if (this.originPoint === null) {
      this.originPoint = point;
    } else {
      // Clear the last update
      canvas.restoreLast();
    }

    this.width = point.x - this.originPoint.x;
    this.height = point.y - this.originPoint.y;

    canvas.setStyle(this.color, this.thickness);
    this.drawShape(this.originPoint, this.width, this.height, canvas);
  }

  protected abstract drawShape(originPoint: Point, width: number, height: number, canvas: Canvas): void;
}

export default DraggableShape;

import Point from '../Point';
import canvas from '../Canvas';
import Utils from '../Utils';
import UpdatableShape from './UpdatableShape';
import type ShapeManager from '../Manager/ShapeManager';
import ShapeType from './ShapeType';

const INTERVAL_BETWEEN_LINE = 10;

class Pencil extends UpdatableShape {
  points: Array<Point> = [];
  private timeLastPoint: Date | null = null;
  protected shapeType: ShapeType = ShapeType.Pencil;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected getExportInfo(): any {
    return { ...super.getExportInfo(), points: this.points };
  }

  async draw(shapeManager: ShapeManager): Promise<void> {
    // To respect the durationMs when there is a lot of point to draw
    // in a short amount of time, thre are two issues :
    // - It's not possible to wait float ms
    // - The function take more than a ms to execute
    // That's why,to create the animation effect :
    // multiple point are drawed, and then a wait is done
    super.draw(shapeManager);

    const durationMs = (this.startDate && this.endDate)
      ? this.endDate - this.startDate
      : 0;
    const speedMultiplicator = 4;
    const latencyInterval = 1 * speedMultiplicator;
    const waitingIntervalMs: number = this.getWaitingInterval(durationMs);

    // Represent the number of line drawned before a wait
    // If waitingIntervalMs is inferior to latencyInterval, wait for each line
    const numberOfDrawPerWait = (waitingIntervalMs !== 0 && waitingIntervalMs <= latencyInterval)
      ? Math.round(latencyInterval / waitingIntervalMs)
      : 1;

    for (let i = 1; i < this.points.length; i += 1) {
      this.drawLine(this.points[i - 1], this.points[i]);
      // If it is not the last line and indes reached numberOfDrawPerWait
      if (i % numberOfDrawPerWait === 0 && i !== this.points.length) {
        // eslint-disable-next-line no-await-in-loop
        await Utils.waitInterval(waitingIntervalMs);
      }
    }
  }

  private getWaitingInterval(durationMs: number): number {
    return durationMs !== 0 ? durationMs / this.points.length : 0;
  }

  update(point: Point): void {
    const [lastPoint] = this.points.slice(-1);
    if (lastPoint === undefined) return;

    const now = new Date();

    if (this.timeLastPoint === null) {
      this.addLine(lastPoint, point, now);
      return;
    }

    const interval = now.getTime() - this.timeLastPoint.getTime();
    if (interval > INTERVAL_BETWEEN_LINE) this.addLine(lastPoint, point, now);
  }

  private addLine(lastPt: Point, newPt: Point, time: Date): void {
    this.points.push(newPt);
    this.timeLastPoint = time;
    this.drawLine(lastPt, newPt);
  }

  private drawLine(p1: Point, p2: Point) {
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(p1.x, p1.y);
    canvas.ctx.lineTo(p2.x, p2.y);
    canvas.ctx.stroke();
    canvas.ctx.closePath();
  }
}

export default Pencil;

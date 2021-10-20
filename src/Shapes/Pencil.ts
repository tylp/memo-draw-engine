import Canvas from '../Canvas';
import Point from '../Point';
import Utils from '../Utils';
import UpdatableShape from './UpdatableShape';
import ShapeType from './ShapeType';
import ShapeManager from '../Manager/ShapeManager';

const INTERVAL_BETWEEN_LINE = 10;
const INTERVAL_BETWEEN_EMIT = 500;

class Pencil extends UpdatableShape {
  points: Array<Point> = [];
  private timeLastPoint: number | null = null;
  private timeSinceLastEmit = 0;
  protected shapeType: ShapeType = ShapeType.Pencil;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected getExportInfo(): any {
    return { ...super.getExportInfo(), points: this.points };
  }

  async draw(shapeManager: ShapeManager, animate: boolean): Promise<void> {
    super.draw(shapeManager, animate);
    this.drawPoints(this.points, this.durationMs, animate, shapeManager);
  }

  async mergePoints(points: Array<Point>, endDate: number, shapeManager: ShapeManager): Promise<void> {
    this.endDate = endDate;
    const newPoints = points.slice(this.points.length - 1);
    this.points = points;
    await this.drawPoints(newPoints, INTERVAL_BETWEEN_EMIT, true, shapeManager);
  }

  private async drawPoints(points: Array<Point>, durationMs: number, animate: boolean, shapeManager: ShapeManager) {
    // To respect the durationMs when there is a lot of point to draw
    // in a short amount of time, thre are two issues :
    // - It's not possible to wait float ms
    // - The function take more than a ms to execute
    // That's why, to create the animation effect :
    // multiple point are drawed, and then a wait is done
    const speedMultiplicator = 4;
    const latencyInterval = 1 * speedMultiplicator;
    const waitingIntervalMs: number = this.getWaitingInterval(durationMs, points);

    // Represent the number of line drawned before a wait
    // If waitingIntervalMs is inferior to latencyInterval, wait for each line
    const numberOfDrawPerWait = (waitingIntervalMs !== 0 && waitingIntervalMs <= latencyInterval)
      ? Math.round(latencyInterval / waitingIntervalMs)
      : 1;

    for (let i = 1; i < points.length; i += 1) {
      this.drawLine(points[i - 1], points[i], shapeManager.canvas);
      // If it is not the last line and indes reached numberOfDrawPerWait
      if (animate && i % numberOfDrawPerWait === 0 && i !== points.length) {
        // eslint-disable-next-line no-await-in-loop
        await Utils.waitInterval(waitingIntervalMs);
      }
    }
  }

  private getWaitingInterval(durationMs: number, points: Array<Point>): number {
    return durationMs !== 0 ? durationMs / points.length : 0;
  }

  update(point: Point, shapeManager: ShapeManager): void {
    const [lastPoint] = this.points.slice(-1);
    if (lastPoint === undefined || this.startDate === undefined) return;

    const now = Date.now();

    if (this.timeLastPoint === null) {
      this.addLine(lastPoint, point, now, shapeManager.canvas);
      return;
    }

    const interval = now - this.timeLastPoint;
    if (interval < INTERVAL_BETWEEN_LINE) return;

    this.addLine(lastPoint, point, now, shapeManager.canvas);

    // Mechanism to pre-emit pencil for better UX
    this.timeSinceLastEmit += interval;
    if (this.timeSinceLastEmit > INTERVAL_BETWEEN_EMIT) {
      this.endDate = now;
      this.timeSinceLastEmit = 0;
      shapeManager.emit();
    }
  }

  private addLine(lastPt: Point, newPt: Point, time: number, canvas: Canvas): void {
    this.points.push(newPt);
    this.timeLastPoint = time;
    this.drawLine(lastPt, newPt, canvas);
  }

  private drawLine(p1: Point, p2: Point, canvas: Canvas) {
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(p1.x, p1.y);
    canvas.ctx.lineTo(p2.x, p2.y);
    canvas.ctx.stroke();
    canvas.ctx.closePath();
  }
}

export default Pencil;

import Point from '../Point';
import Utils from '../Utils';
import UpdatableShape from './UpdatableShape';
import ShapeType from './ShapeType';
import type ShapeManager from '../Manager/ShapeManager';

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
    if (animate) return this.drawWithAnimation([], this.points, this.durationMs, shapeManager);
    this.drawPoints(this.points, shapeManager);
    return Promise.resolve();
  }

  async mergePoints(points: Array<Point>, endDate: number, shapeManager: ShapeManager): Promise<void> {
    if (!this.endDate) return;
    const duration = endDate - this.endDate;
    this.endDate = endDate;
    const newPoints = points.slice(this.points.length - 1);
    const oldPoints = [...this.points];
    this.points = points;
    await this.drawWithAnimation(oldPoints, newPoints, duration, shapeManager);
  }

  private async drawWithAnimation(oldPoints: Array<Point>, newPoints: Array<Point>, durationMs: number, shapeManager: ShapeManager) {
    const waitingInterval = durationMs / newPoints.length;
    for (let i = 0; i < newPoints.length - 1; i += 1) {
      oldPoints.push(newPoints[i]);
      if (oldPoints.length >= 2) {
        shapeManager.restoreLast();
        this.drawPoints(oldPoints, shapeManager);
      }
      // eslint-disable-next-line no-await-in-loop
      await Utils.waitInterval(waitingInterval);
    }
  }

  update(point: Point, shapeManager: ShapeManager): void {
    if (this.startDate === undefined) return;
    const now = Date.now();

    if (this.timeLastPoint === null) {
      this.addPoint(point, now, shapeManager);
      return;
    }

    const interval = now - this.timeLastPoint;
    if (interval < INTERVAL_BETWEEN_LINE) return;

    this.addPoint(point, now, shapeManager);

    // Mechanism to pre-emit pencil for better UX
    this.timeSinceLastEmit += interval;
    if (this.timeSinceLastEmit > INTERVAL_BETWEEN_EMIT) {
      this.endDate = now;
      this.timeSinceLastEmit = 0;
      shapeManager.emit();
    }
  }

  private addPoint(point: Point, time: number, shapeManager: ShapeManager): void {
    this.points.push(point);
    this.timeLastPoint = time;
    shapeManager.restoreLast();
    this.drawPoints(this.points, shapeManager);
  }

  // Draw points unsing quadraticCurve between each points
  // From https://github.com/embiem/react-canvas-draw (MIT)
  private drawPoints(points: Array<Point>, shapeManager: ShapeManager) {
    let p1 = points[0];
    let p2 = points[1];

    shapeManager.canvas.ctx.moveTo(p2.x, p2.y);
    shapeManager.canvas.ctx.beginPath();

    for (let i = 1; i < points.length; i += 1) {
      const midPoint = this.midPointBtw(p1, p2);
      shapeManager.canvas.ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
      p1 = points[i];
      p2 = points[i + 1];
    }

    // Finish last point with straight line
    shapeManager.canvas.ctx.lineTo(p1.x, p1.y);
    shapeManager.canvas.ctx.stroke();
  }

  private midPointBtw(p1: Point, p2: Point) {
    return new Point(
      p1.x + (p2.x - p1.x) / 2,
      p1.y + (p2.y - p1.y) / 2,
    );
  }
}

export default Pencil;

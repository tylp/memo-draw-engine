import Point from '../Point';
import UpdatableShape from './UpdatableShape';
import ShapeType from './ShapeType';
import Canvas from '../Canvas';
import AnimationManager from '../Manager/AnimationManager';

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

  public draw(canvas: Canvas): void {
    super.draw(canvas);
    this.drawPoints(this.points, canvas);
  }

  async mergePoints(points: Array<Point>, endDate: number, canvas: Canvas, animationManager: AnimationManager): Promise<void> {
    if (!this.endDate) return;
    const duration = endDate - this.endDate;
    this.endDate = endDate;
    const newPoints = points.slice(this.points.length - 1);
    const oldPoints = [...this.points];
    this.points = points;
    await this.drawWithAnimation(oldPoints, newPoints, duration, canvas, animationManager);
  }

  public animate(canvas: Canvas, animationManager: AnimationManager): Promise<void> {
    super.animate(canvas, animationManager);
    return this.drawWithAnimation([], this.points, this.durationMs, canvas, animationManager);
  }

  private async drawWithAnimation(oldPoints: Array<Point>, newPoints: Array<Point>, durationMs: number, canvas: Canvas, animationManager: AnimationManager) {
    return animationManager.animate({
      draw: (progress: number) => {
        canvas.restoreLast();
        const nbPointsToDraw = newPoints.length * progress;
        const pointsToDraw = oldPoints.concat(newPoints.slice(0, nbPointsToDraw));
        this.drawPoints(pointsToDraw, canvas);
      },
      duration: durationMs,
    });
  }

  update(point: Point, canvas: Canvas): void {
    if (this.startDate === undefined) return;
    const now = Date.now();

    if (this.timeLastPoint === null) {
      this.addPoint(point, now, canvas);
      return;
    }

    const interval = now - this.timeLastPoint;
    if (interval < INTERVAL_BETWEEN_LINE) return;

    this.addPoint(point, now, canvas);

    // Mechanism to pre-emit pencil for better UX
    this.timeSinceLastEmit += interval;
  }

  // Pre-emit the pencil if more than INTERVAL_BETWEEN_EMIT
  // To allow a better real-time UX
  shouldPreEmit(): boolean {
    return this.timeSinceLastEmit > INTERVAL_BETWEEN_EMIT;
  }

  resetForPreEmit(): void {
    this.endDate = Date.now();
    this.timeSinceLastEmit = 0;
  }

  private addPoint(point: Point, time: number, canvas: Canvas): void {
    this.points.push(point);
    this.timeLastPoint = time;
    canvas.restoreLast();
    this.drawPoints(this.points, canvas);
  }

  // Draw points unsing quadraticCurve between each points
  // From https://github.com/embiem/react-canvas-draw (MIT)
  private drawPoints(points: Array<Point>, canvas: Canvas) {
    if (points.length <= 2) return;
    let p1 = points[0];
    let p2 = points[1];

    canvas.ctx.moveTo(p2.x, p2.y);
    canvas.ctx.beginPath();

    for (let i = 1; i < points.length; i += 1) {
      const midPoint = this.midPointBtw(p1, p2);
      canvas.ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
      p1 = points[i];
      p2 = points[i + 1];
    }

    // Finish last point with straight line
    canvas.ctx.lineTo(p1.x, p1.y);
    canvas.ctx.stroke();
  }

  private midPointBtw(p1: Point, p2: Point) {
    return new Point(
      p1.x + (p2.x - p1.x) / 2,
      p1.y + (p2.y - p1.y) / 2,
    );
  }
}

export default Pencil;

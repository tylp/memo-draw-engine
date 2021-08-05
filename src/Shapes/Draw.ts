import Shape from './Shape';
import Point from '../Point';
import drawState from '../DrawState';
import canvas from '../Canvas';

class Draw extends Shape {
  private points : Array<Point>;

  constructor(points : Array<Point> = []) {
    super();
    this.points = points;
  }

  async draw(durationMs : number) : Promise<void> {
    const waitingIntervalMs : number = this.getWaitingInterval(durationMs);

    for (let i = 1; i < this.points.length; i += 1) {
      this.drawLine(this.points[i - 1], this.points[i]);
      // eslint-disable-next-line no-await-in-loop
      await this.waitInterval(waitingIntervalMs);
    }
  }

  private getWaitingInterval(durationMs : number) : number {
    return durationMs !== 0 ? this.points.length / durationMs : 0;
  }

  update(event: MouseEvent) : void {
    if (this.points.length === 0) {
      this.points.push(drawState.basePoint as Point);
    }

    const [lastPoint] = this.points.slice(-1);
    const newPoint = new Point(event.clientX, event.clientY);
    this.points.push(newPoint);

    this.drawLine(lastPoint, newPoint);
  }

  private drawLine(p1: Point, p2: Point) {
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(p1.x, p1.y);
    canvas.ctx.lineTo(p2.x, p2.y);
    this.setColorAndThickness(canvas.ctx);
    canvas.ctx.stroke();
    canvas.ctx.closePath();
  }
}

export default Draw;

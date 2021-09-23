import Point from '../Point';
import canvas from '../Canvas';
import Utils from '../Utils';
import UpdatableShape from './UpdatableShape';

class Draw extends UpdatableShape {
  points : Array<Point> = [];

  async draw() : Promise<void> {
    // To respect the durationMs when there is a lot of point to draw
    // in a short amount of time, thre are two issues :
    // - It's not possible to wait float ms
    // - The function take more than a ms to execute
    // That's why,to create the animation effect :
    // multiple point are drawed, and then a wait is done
    const durationMs = (this.startDate && this.endDate)
      ? this.endDate - this.startDate
      : 0;
    const speedMultiplicator = 4;
    const latencyInterval = 1 * speedMultiplicator;
    const waitingIntervalMs : number = this.getWaitingInterval(durationMs);

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

  private getWaitingInterval(durationMs : number) : number {
    return durationMs !== 0 ? durationMs / this.points.length : 0;
  }

  update(event: MouseEvent) : void {
    const [lastPoint] = this.points.slice(-1);
    const newPoint = new Point(event.clientX, event.clientY);
    this.points.push(newPoint);

    this.drawLine(lastPoint, newPoint);
  }

  private drawLine(p1: Point, p2: Point) {
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(p1.x, p1.y);
    canvas.ctx.lineTo(p2.x, p2.y);
    canvas.ctx.stroke();
    canvas.ctx.closePath();
  }
}

export default Draw;

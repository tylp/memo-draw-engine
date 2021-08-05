import type { ShapeManager } from '../ShapeManager';
import drawState from '../DrawState';

abstract class Shape {
  color: string;
  thickness: number;

  constructor() {
    this.color = drawState.color;
    this.thickness = drawState.thickness;
  }

  // Use to definitely draw shape (viewer side)
  abstract draw(durationMs : number, shapeManager : ShapeManager) : void;
  // Use for live view of shape (drawer side)
  abstract update(event : MouseEvent, shapeManager : ShapeManager) : void;

  protected setColorAndThickness(ctx : CanvasRenderingContext2D) : void {
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.lineWidth = this.thickness;
  }

  protected async waitInterval(waitingIntervalMs : number) : Promise<void> {
    if (waitingIntervalMs !== 0) {
      await new Promise((resolve) => setTimeout(resolve, waitingIntervalMs));
    }
  }
}

export default Shape;

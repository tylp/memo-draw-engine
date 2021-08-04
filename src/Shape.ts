import canvas from './Canvas';
import drawState from './DrawState';

abstract class Shape {
  color: string;
  thickness: number;
  
  constructor() {
    this.color = drawState.color;
    this.thickness = drawState.thickness;
  }

  // Use to definitely draw shape (viewer side)
  abstract draw(durationMs : number) : void;
  // Use for live view of shape (drawer side)
  abstract update(event : MouseEvent) : void;

  protected setColorAndThickness() : void {
    canvas.ctx.strokeStyle = this.color;
    canvas.ctx.lineWidth = this.thickness;
  }

  protected async waitInterval(waitingIntervalMs : number) : Promise<void> {
    if (waitingIntervalMs !== 0) {
      await new Promise(resolve => setTimeout(resolve, waitingIntervalMs));
    }
  }
}

export default Shape;
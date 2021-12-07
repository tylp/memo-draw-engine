import Canvas from '../Canvas';
import IWindowEventHandler from './IWindowEventHandler';

class CanvasManager implements IWindowEventHandler {
  // Canvas on which shape are stored and animated
  backgroundCanvas: Canvas;
  // Canvas on which shape are drawn
  userCanvas: Canvas;
  canvasBounds: DOMRect;

  constructor(canvasElement: HTMLCanvasElement) {
    const backCanvasEl = this.duplicateCanvas(canvasElement);
    this.userCanvas = new Canvas(canvasElement);
    this.backgroundCanvas = new Canvas(backCanvasEl);
    this.canvasBounds = canvasElement.getBoundingClientRect();
  }

  public recalculateDimensions(): void {
    this.updateBounds();
    this.updateDimensions();
  }

  public updateBounds(): void {
    this.canvasBounds = this.userCanvas.canvasElement.getBoundingClientRect();
  }

  public updateDimensions(): void {
    this.backgroundCanvas.updateDimension(this.canvasBounds);
    this.userCanvas.updateDimension(this.canvasBounds);
    // TODO redraw all the shapes with new dimensions
    this.backgroundCanvas.restoreLast();
  }

  public reset(): void {
    this.backgroundCanvas.reset();
    this.userCanvas.reset();
  }

  private duplicateCanvas(canvasElement: HTMLCanvasElement): HTMLCanvasElement {
    const tempCanvasElement = canvasElement.cloneNode() as HTMLCanvasElement;
    tempCanvasElement.style.zIndex = String(Number(canvasElement.style.zIndex || 0) - 1);
    canvasElement.parentElement?.insertBefore(tempCanvasElement, canvasElement);
    return tempCanvasElement;
  }

  resize(): void {
    this.recalculateDimensions();
  }

  scroll(): void {
    this.updateBounds();
  }
}

export default CanvasManager;

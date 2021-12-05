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
    this.userCanvas.preventMobileScrolling();
    this.backgroundCanvas = new Canvas(backCanvasEl);
    this.canvasBounds = canvasElement.getBoundingClientRect();
  }

  updateBounds(): void {
    this.canvasBounds = this.userCanvas.canvasElement.getBoundingClientRect();
    this.backgroundCanvas.updateDimension(this.canvasBounds);
    this.userCanvas.updateDimension(this.canvasBounds);
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
    this.updateBounds();
  }

  scroll(): void {
    this.updateBounds();
  }
}

export default CanvasManager;

import Canvas from '../Canvas';

class CanvasManager {
  // Canvas on which shape are stored and animated
  backgroundCanvas: Canvas;
  // Canvas on which shape are drawn
  userCanvas: Canvas;

  constructor(canvasElement: HTMLCanvasElement) {
    const backCanvasEl = this.duplicateCanvas(canvasElement);
    this.userCanvas = new Canvas(canvasElement);
    this.backgroundCanvas = new Canvas(backCanvasEl);
  }

  duplicateCanvas(canvasElement: HTMLCanvasElement): HTMLCanvasElement {
    const tempCanvasElement = canvasElement.cloneNode() as HTMLCanvasElement;
    tempCanvasElement.style.zIndex = String(Number(canvasElement.style.zIndex || 0) - 1);
    tempCanvasElement.style.position = 'absolute';
    canvasElement.parentElement?.insertBefore(tempCanvasElement, canvasElement);
    return tempCanvasElement;
  }
}

export default CanvasManager;

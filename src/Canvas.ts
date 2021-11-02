import AlphaColor from './Color/AlphaColor';

class Canvas {
  ctx: CanvasRenderingContext2D;
  canvasElement: HTMLCanvasElement;
  lastImageData: ImageData | null = null;
  private _backgroundCanvas: Canvas | null = null;

  get backgroundCanvas(): Canvas {
    if (this._backgroundCanvas === null) {
      throw new Error('Cannot access backgroundCanvas of a background canvas');
    }
    return this._backgroundCanvas;
  }

  constructor(canvasElement: HTMLCanvasElement, createBackground = true) {
    this.canvasElement = canvasElement;
    const newCtx = this.canvasElement.getContext('2d');
    Canvas.validateContext(newCtx);
    this.ctx = newCtx;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';

    if (createBackground) this.createTemporaryCanvas();

    this.storeLast();
  }

  private static validateContext(ctx: CanvasRenderingContext2D | null): asserts ctx is CanvasRenderingContext2D {
    if (ctx === null) {
      throw new Error('2d context of canvas is null, canvas may be not supported on your browser');
    }
  }

  setStyle(color: AlphaColor, thickness: number): void {
    const rgba = color.toRgba();
    this.ctx.fillStyle = rgba;
    this.ctx.strokeStyle = rgba;
    this.ctx.lineWidth = thickness;
  }

  clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }

  storeLast(): void {
    this.lastImageData = this.ctx.getImageData(
      0, 0, this.canvasElement.width, this.canvasElement.height,
    );
  }

  restoreLast(): void {
    if (this.lastImageData !== null) {
      this.ctx.putImageData(this.lastImageData, 0, 0);
    }
  }

  createTemporaryCanvas(): void {
    const tempCanvasElement = this.canvasElement.cloneNode() as HTMLCanvasElement;
    tempCanvasElement.style.zIndex = '-1';
    tempCanvasElement.style.position = 'absolute';
    this.canvasElement.parentElement?.insertBefore(tempCanvasElement, this.canvasElement);
    // Create a new canvas without re-creating background canvas
    this._backgroundCanvas = new Canvas(tempCanvasElement, false);
  }
}

export default Canvas;

import AlphaColor from './Color/AlphaColor';

class Canvas {
  ctx: CanvasRenderingContext2D;
  canvasElement: HTMLCanvasElement;
  lastImageData: ImageData | null = null;

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvasElement = canvasElement;
    const newCtx = this.canvasElement.getContext('2d');
    Canvas.validateContext(newCtx);
    this.ctx = newCtx;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
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
}

export default Canvas;

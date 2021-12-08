import Point from './Point';
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
    this.setContextAttributes();
    this.storeLast();
  }

  public setStyle(color: AlphaColor, thickness: number): void {
    const rgba = color.toRgba();
    this.ctx.fillStyle = rgba;
    this.ctx.strokeStyle = rgba;
    this.ctx.lineWidth = thickness;
  }

  public reset(): void {
    this.clearCanvas();
    this.storeLast();
  }

  public updateDimension(bounds: DOMRect): void {
    this.canvasElement.width = bounds.width;
    this.canvasElement.height = bounds.height;
    // Mandatory to reset canvas attributes
    this.setContextAttributes();
  }

  public clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }

  public storeLast(): void {
    this.lastImageData = this.ctx.getImageData(
      0, 0, this.canvasElement.width, this.canvasElement.height,
    );
  }

  public restoreLast(): void {
    if (this.lastImageData !== null) {
      this.ctx.putImageData(this.lastImageData, 0, 0);
    }
  }

  public getAbsolutePoint(point: Point): Point {
    return new Point(point.x * this.canvasElement.width, point.y * this.canvasElement.height);
  }

  public getAbsoluteWidth(width: number): number {
    return width * this.canvasElement.width;
  }

  public getAbsoluteHeight(height: number): number {
    return height * this.canvasElement.height;
  }

  public preventMobileScrolling(): void {
    const preventDefault = (event: Event) => event.preventDefault();

    this.canvasElement.addEventListener('touchstart', preventDefault);
    this.canvasElement.addEventListener('touchmove', preventDefault);
    this.canvasElement.addEventListener('touchend', preventDefault);
    this.canvasElement.addEventListener('touchcancel', preventDefault);
  }

  private static validateContext(ctx: CanvasRenderingContext2D | null): asserts ctx is CanvasRenderingContext2D {
    if (ctx === null) {
      throw new Error('2d context of canvas is null, canvas may be not supported on your browser');
    }
  }

  private setContextAttributes(): void {
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }
}

export default Canvas;

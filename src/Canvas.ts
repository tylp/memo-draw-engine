import AlphaColor from './Color/AlphaColor';

export default class Canvas {
  ctx: CanvasRenderingContext2D;
  canvasElement: HTMLCanvasElement;

  constructor(canvasElem: HTMLCanvasElement) {
    this.canvasElement = canvasElem;

    const newCtx = this.canvasElement.getContext('2d');
    Canvas.validateContext(newCtx);
    this.ctx = newCtx;
    this.ctx.lineCap = 'round';
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
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }
}

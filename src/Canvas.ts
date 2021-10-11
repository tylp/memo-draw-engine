import AlphaColor from './Color/AlphaColor';

export default class Canvas {
  private _ctx: CanvasRenderingContext2D;
  private _canvasElement: HTMLCanvasElement;

  constructor(canvasElement: HTMLCanvasElement) {
    this._canvasElement = canvasElement;

    const ctx = this.canvasElement.getContext('2d');
    Canvas.validateContext(ctx);
    this._ctx = ctx;
    this.ctx.lineCap = 'round';
  }

  get ctx(): CanvasRenderingContext2D {
    return this._ctx;
  }

  get canvasElement(): HTMLCanvasElement {
    if (this._canvasElement === null) {
      throw new Error('Canvas is not intialized');
    }
    return this._canvasElement;
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

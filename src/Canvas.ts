import AlphaColor from './Color/AlphaColor';
import drawState from './DrawState';

class Canvas {
  private _ctx : CanvasRenderingContext2D | null = null;
  private _canvasElement : HTMLCanvasElement | null = null;

  get ctx() : CanvasRenderingContext2D {
    if (this._ctx === null) {
      throw new Error('Canvas rendering context is not registered');
    }
    return this._ctx;
  }

  get canvasElement() : HTMLCanvasElement {
    if (this._canvasElement === null) {
      throw new Error('Canvas is not intialized');
    }
    return this._canvasElement;
  }

  initialize(canvasId : string) {
    this._canvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
    this._ctx = this.canvasElement.getContext('2d');
    this.throwIfNotSupported();
    this.ctx.lineCap = 'round';
  }

  private throwIfNotSupported() {
    if (this._ctx === null) {
      throw new Error('2d context of canvas is null, canvas may be not supported on your browser');
    }
  }

  setStyle(color: AlphaColor, thickness: number) {
    const rgba = color.toRgba();
    this.ctx.fillStyle = rgba;
    this.ctx.strokeStyle = rgba;
    this.ctx.lineWidth = thickness;
  }

  clearCanvas() : void {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.ctx.fillStyle = drawState.rgba;
  }
}

const canvas = new Canvas();
export default canvas;

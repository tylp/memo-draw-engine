import drawState from './DrawState';

class Canvas {
  private _ctx : CanvasRenderingContext2D | null;
  canvasElement : HTMLCanvasElement;

  // Use of getter to check if canvas is registered
  get ctx() : CanvasRenderingContext2D {
    if (this._ctx === null) {
      throw new Error('Canvas rendering context is not registered');
    }
    return this._ctx;
  }

  constructor() {
    this.canvasElement = document.getElementById('draw-canvas') as HTMLCanvasElement;
    this._ctx = this.canvasElement.getContext('2d');
    this.throwIfNotSupported();
    this.ctx.lineCap = 'round';
    this.setStyle();
  }

  private throwIfNotSupported() {
    if (this.ctx === null) {
      throw new Error('2d context of canvas is null');
    }
  }

  setStyle() {
    const alphaColor = drawState.getAlphaColor();
    drawState.rgba = alphaColor.toRgba();
    this.ctx.fillStyle = drawState.rgba;
    this.ctx.strokeStyle = drawState.rgba;
    this.ctx.lineWidth = drawState.thickness;
  }

  clearCanvas() : void {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.ctx.fillStyle = drawState.rgba;
  }
}

export default new Canvas();

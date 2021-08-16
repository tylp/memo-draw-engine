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
  }

  private throwIfNotSupported() {
    if (this.ctx === null) {
      throw new Error('2d context of canvas is null');
    }
  }

  clearCanvas(restoreColor : string | null = null) : void {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    if (restoreColor !== null) {
      this.ctx.fillStyle = restoreColor;
    }
  }
}

export default new Canvas();

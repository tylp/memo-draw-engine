/* eslint-disable no-param-reassign */
import drawState from '../DrawState';
import Shape from './Shape';
import canvas from '../Canvas';
import AlphaColor from '../Color/AlphaColor';
import Point from '../Point';
import type ShapeManager from '../Manager/ShapeManager';
import HueLight from '../Color/HueLight';

class Fill extends Shape {
  edges! : Set<number>;
  baseColor! : AlphaColor;
  drawColor! : AlphaColor;
  imageData! : ImageData;
  originData! : Uint8ClampedArray;
  canvasWidth! : number;
  canvasHeight! : number;
  originPoint : Point | null = null;

  exportInfo(): unknown {
    return { ...super.exportInfo(), originPoint: this.originPoint };
  }

  async draw(shapeManager : ShapeManager): Promise<void> {
    return new Promise((resolve) => {
      super.draw(shapeManager);
      this.fill();
      resolve();
    });
  }

  // Algorithm from http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
  private fill() : void {
    if (this.originPoint == null) return;

    this.initialize();

    const basePixelPos = this.getPixelPos(this.originPoint.x, this.originPoint.y);
    this.baseColor = this.getPixelColor(basePixelPos);

    // Check if the clicked color is not the current fill color
    // Do not check using pure color equality because canvas element
    // display color using opacity variation
    if (HueLight.alphaColorEqual(this.baseColor, this.drawColor)) return;

    const pixelStack : Array<Array<number>> = [[this.originPoint.x, this.originPoint.y]];

    while (pixelStack.length) {
      let reachLeft: boolean;
      let reachRight: boolean;

      const newPos = pixelStack.pop() as number[];
      const x = newPos[0];
      let y = newPos[1];

      let pixelPos = this.getPixelPos(x, y);

      // Go up until we have can't fill
      while (y >= 0 && this.shouldFill(pixelPos)) {
        y -= 1;
        pixelPos -= this.canvasWidth * 4;
      }

      // Go down because y reached a border
      pixelPos += this.canvasWidth * 4;
      y += 1;

      // Reset states
      reachLeft = false;
      reachRight = false;

      // Fill pixel down until we can't
      while (y < this.canvasHeight && this.shouldFill(pixelPos)) {
        this.fillPixel(pixelPos);

        // Check left
        if (x > 0) {
          if (this.shouldFill(pixelPos - 4) && !reachLeft) {
            pixelStack.push([x - 1, y]);
            reachLeft = true;
          } else if (reachLeft) {
            reachLeft = false;
          }
        }

        // Check right
        if (x < this.canvasWidth - 1) {
          if (this.shouldFill(pixelPos + 4) && !reachRight) {
            pixelStack.push([x + 1, y]);
            reachRight = true;
          } else if (reachRight) {
            reachRight = false;
          }
        }

        // Go down
        y += 1;
        pixelPos += this.canvasWidth * 4;
      }
    }

    // Fill edges
    this.edges.forEach((pix) => this.fillPixel(pix));
    canvas.ctx.putImageData(this.imageData, 0, 0);
  }

  private initialize() {
    this.imageData = canvas.ctx.getImageData(0, 0,
      canvas.canvasElement.width,
      canvas.canvasElement.height);

    // Used to get the edges
    this.originData = new Uint8ClampedArray(this.imageData.data);
    this.edges = new Set();

    this.canvasWidth = canvas.canvasElement.width;
    this.canvasHeight = canvas.canvasElement.height;

    this.drawColor = drawState.getAlphaColor();
  }

  private getPixelPos(x : number, y : number) : number {
    return (y * this.canvasWidth + x) * 4;
  }

  private getPixelColor(pixelPos: number, data : Uint8ClampedArray = this.imageData.data) {
    return new AlphaColor(
      data[pixelPos + 0],
      data[pixelPos + 1],
      data[pixelPos + 2],
      data[pixelPos + 3],
    );
  }

  private shouldFill(pixelPos: number) : boolean {
    const color = this.getPixelColor(pixelPos);
    const isBaseColor = this.baseColor.equal(color);
    if (!isBaseColor) {
      const originColor = this.getPixelColor(pixelPos, this.originData);
      // flag pixel as edge
      if (originColor.equal(color)) this.edges.add(pixelPos);
    }
    return isBaseColor;
  }

  private fillPixel(pixelPos: number) {
    this.imageData.data[pixelPos] = this.drawColor.red;
    this.imageData.data[pixelPos + 1] = this.drawColor.green;
    this.imageData.data[pixelPos + 2] = this.drawColor.blue;
    this.imageData.data[pixelPos + 3] = this.drawColor.alpha;
  }
}

export default Fill;

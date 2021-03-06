/* eslint-disable no-param-reassign */
import Shape from './Shape';
import AlphaColor from '../Color/AlphaColor';
import Point from '../Point';
import HueLight from '../Color/HueLight';
import ShapeType from './ShapeType';
import Canvas from '../Canvas';

type CustomNumberCollection = Uint8ClampedArray | Array<number>;

class Fill extends Shape {
  dismissed = false;
  edges!: Set<number>;
  baseColor!: AlphaColor;
  imageData!: ImageData;
  originData!: Uint8ClampedArray;
  filledPixels: Array<number> = [];
  canvasWidth!: number;
  canvasHeight!: number;
  originPoint: Point | null = null;
  protected shapeType: ShapeType = ShapeType.Fill;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected getExportInfo(): any {
    return { ...super.getExportInfo(), originPoint: this.originPoint };
  }

  public draw(canvas: Canvas): void {
    this.fill(canvas);
    this.clearData();
  }

  // Used to remove filledPixels in case of resize
  public reset(): void {
    this.filledPixels = [];
  }

  // Algorithm from http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
  private fill(canvas: Canvas): void {
    // Redraw fill if it was already calculated
    if (this.filledPixels.length !== 0) {
      this.redraw(canvas);
      return;
    }

    if (this.originPoint == null) return;

    let originPoint = canvas.getAbsolutePoint(this.originPoint);

    // Ovewrite originPoint with round numbers
    originPoint = {
      x: Math.round(originPoint.x),
      y: Math.round(originPoint.y),
    };

    this.initialize(canvas);

    const basePixelPos = this.getPixelPos(originPoint.x, originPoint.y);
    this.baseColor = this.getPixelColor(basePixelPos);

    // Replace color by addition of base + new to allow opacity addition
    this.color = this.baseColor.add(this.color);

    // Check if the clicked color is not the current fill color
    // Do not check using pure color equality because canvas element
    // display color using opacity variation
    // Store the result to avoid adding it to shape stack
    if (HueLight.alphaColorEqual(this.baseColor, this.color)) {
      this.dismissed = true;
      return;
    }

    const pixelStack: Array<Array<number>> = [[originPoint.x, originPoint.y]];

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

  private initialize(canvas: Canvas) {
    this.imageData = canvas.ctx.getImageData(0, 0,
      canvas.canvasElement.width,
      canvas.canvasElement.height);

    // Used for further redraw
    this.filledPixels = [];
    // Used to get the edges
    this.originData = new Uint8ClampedArray(this.imageData.data);
    this.edges = new Set();

    this.canvasWidth = canvas.canvasElement.width;
    this.canvasHeight = canvas.canvasElement.height;
  }

  private getPixelPos(x: number, y: number): number {
    return (y * this.canvasWidth + x) * 4;
  }

  private getPixelColor(pixelPos: number, data: Uint8ClampedArray = this.imageData.data) {
    return new AlphaColor(
      data[pixelPos + 0],
      data[pixelPos + 1],
      data[pixelPos + 2],
      data[pixelPos + 3],
    );
  }

  private shouldFill(pixelPos: number): boolean {
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
    this.setPixelData(pixelPos, this.imageData.data);
    this.setPixelData(pixelPos, this.filledPixels);
  }

  private setPixelData(pixelPos: number, data: CustomNumberCollection) {
    data[pixelPos] = this.color.red;
    data[pixelPos + 1] = this.color.green;
    data[pixelPos + 2] = this.color.blue;
    data[pixelPos + 3] = this.color.alpha;
  }

  // Avoid to store useless large objects
  // Only keep filledPixels for further redraw
  private clearData() {
    // Trick because image data cannot be 0 length
    this.imageData = new ImageData(1, 1);
    this.edges = new Set();
    this.originData = new Uint8ClampedArray(0);
  }

  private redraw(canvas: Canvas) {
    const imageData = canvas.ctx.getImageData(0, 0,
      canvas.canvasElement.width,
      canvas.canvasElement.height);
    this.filledPixels.forEach((pix, i) => { imageData.data[i] = pix; });
    canvas.ctx.putImageData(imageData, 0, 0);
  }
}

export default Fill;

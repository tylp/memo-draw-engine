import AnimationManager from '../Manager/AnimationManager';
import Canvas from '../Canvas';
import Point from '../Point';
import UpdatableShape from './UpdatableShape';

abstract class DraggableShape extends UpdatableShape {
  originPoint: Point | null = null;
  width = 0;
  height = 0;

  public draw(canvas: Canvas): void {
    super.draw(canvas);
    if (this.originPoint === null) return;
    this.drawShape(this.originPoint, this.width, this.height, canvas);
  }

  public async animate(canvas: Canvas, animationManager: AnimationManager): Promise<void> {
    super.animate(canvas, animationManager);

    return animationManager.animate({
      draw: (progress: number) => {
        canvas.restoreLast();
        this.drawShape(this.originPoint as Point, this.width * progress, this.height * progress, canvas);
      },
      duration: this.durationMs,
    });
  }

  update(point: Point, canvas: Canvas): void {
    // Origin point is null if it is the first update
    if (this.originPoint === null) {
      this.originPoint = point;
    } else {
      // Clear the last update
      canvas.restoreLast();
    }

    this.width = point.x - this.originPoint.x;
    this.height = point.y - this.originPoint.y;

    canvas.setStyle(this.color, this.thickness);
    this.drawShape(this.originPoint, this.width, this.height, canvas);
  }

  protected abstract drawShape(originPoint: Point, width: number, height: number, canvas: Canvas): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected getExportInfo(): any {
    return {
      ...super.getExportInfo(),
      originPoint: this.originPoint,
      width: this.width,
      height: this.height,
    };
  }
}

export default DraggableShape;

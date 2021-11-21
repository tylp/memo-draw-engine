import Canvas from '../Canvas';
import UpdatableShape from '../Shapes/UpdatableShape';
import Shape from '../Shapes/Shape';

type AnimateSpec = { draw: (progress: number) => void, duration: number };
type AnimationInfo = { requestFrameId: number, resolvePromise: () => void };

class AnimationManager {
  queue: Array<() => Promise<void>> = [];
  available = true;
  private availablePromise!: Promise<void>;
  private animationsInfo: Array<AnimationInfo> = [];

  add(animation: () => Promise<void>): Promise<void> {
    this.queue.push(animation);
    if (this.available) this.createLoop();
    return this.availablePromise;
  }

  // Animate if UpdatableShape, draw else
  public animateDrawShape(shape: Shape, canvas: Canvas): Promise<void> {
    if (shape instanceof UpdatableShape) {
      return shape.animate(canvas, this);
    }
    return new Promise((resolve) => {
      shape.draw(canvas);
      resolve();
    });
  }

  public animate({ draw, duration }: AnimateSpec): Promise<void> {
    const index = this.animationsInfo.length;
    const start = performance.now();
    return new Promise((resolve) => {
      const animate = (time: number) => {
        const timeFraction = AnimationManager.getTimeFraction(time, start, duration);
        const progress = AnimationManager.timing(timeFraction);

        draw(progress);

        if (timeFraction < 1) {
          this.animationsInfo[index].requestFrameId = requestAnimationFrame(animate);
        } else {
          this.animationsInfo.splice(index, 1);
          resolve();
        }
      };
      const id = requestAnimationFrame(animate);
      this.animationsInfo[index] = { resolvePromise: resolve, requestFrameId: id };
    });
  }

  public stop(): void {
    this.animationsInfo.forEach((animationInfo) => {
      cancelAnimationFrame(animationInfo.requestFrameId);
      animationInfo.resolvePromise();
    });
  }

  private async createLoop(): Promise<void> {
    this.availablePromise = new Promise((resolve) => this.loop(resolve));
  }

  private async loop(resolve: () => void) {
    this.available = false;
    while (this.queue.length !== 0) {
      const animation = this.queue.shift();
      // eslint-disable-next-line no-await-in-loop
      if (animation) await animation();
    }
    this.available = true;
    resolve();
  }

  private static getTimeFraction(time: number, start: number, duration: number) {
    let timeFraction = (time - start) / duration;
    if (timeFraction < 0) timeFraction = 0;
    if (timeFraction > 1) timeFraction = 1;
    return timeFraction;
  }

  // Used to transform animation type (linear / bezier)
  private static timing(progress: number): number {
    return progress;
  }
}

export default AnimationManager;

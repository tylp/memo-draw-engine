import Point from '../Point';

interface ICanvasEventHandlder {
  mouseDown(point: Point): void;
  mouseMove(point: Point): void;
  mouseLeave(): void;
  mouseUp(): void;
}

export default ICanvasEventHandlder;

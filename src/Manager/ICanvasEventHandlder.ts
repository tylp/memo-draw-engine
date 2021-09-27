import Point from '../Point';

interface ICanvasEventHandlder {
  drawBegin(point : Point) : void;
  drawMove(point : Point) : void;
  drawFinish() : void;
}

export default ICanvasEventHandlder;

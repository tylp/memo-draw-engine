import Point from '../Point';

interface ICanvasEventHandlder {
  down(point : Point) : void;
  move(point : Point) : void;
  up() : void;
}

export default ICanvasEventHandlder;

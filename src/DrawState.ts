import ShapeType from './ShapeType';
import Point from './Point';

// State class use as a singleton to share drawing state
class DrawState {
  color : string;
  thickness : number;
  shapeType : ShapeType;

  isDrawing: boolean;
  basePoint : Point | null;

  constructor() {
    // Default state is drawing large black
    this.color = 'red';
    this.thickness = 2;
    this.shapeType = ShapeType.Draw;

    // Default not drawing & no current shape
    this.isDrawing = false;
    this.basePoint = null;
  }
}

export default new DrawState();

import ShapeType from './Shapes/ShapeType';
import Color from './Color/Color';
import AlphaColor from './Color/AlphaColor';

// State class use as a singleton to share drawing state
class DrawState {
  color : Color;
  opacity : number;
  rgba! : string;
  thickness : number;
  shapeType : ShapeType;

  constructor() {
    this.shapeType = ShapeType.Fill;
    this.color = new Color(0, 0, 0);
    this.opacity = 1;
    this.thickness = 5;
  }

  getAlphaColor() : AlphaColor {
    return AlphaColor.getAlphaColorFromColor(this.color, this.opacity);
  }
}

const drawState = new DrawState();
export default drawState;

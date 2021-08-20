import ShapeType from './ShapeType';
import Color from './Color';
import Colors from './Colors';
import AlphaColor from './AlphaColor';

// State class use as a singleton to share drawing state
class DrawState {
  color : Color;
  opacity : number;
  rgba! : string;
  thickness : number;
  shapeType : ShapeType;

  constructor() {
    this.shapeType = ShapeType.Fill;
    this.color = Colors.blue;
    this.opacity = 1;
    this.thickness = 3;
  }

  getAlphaColor() : AlphaColor {
    return AlphaColor.getAlphaColorFromColor(this.color, this.opacity);
  }
}

export default new DrawState();

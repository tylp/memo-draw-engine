import ShapeType from './Shapes/ShapeType';
import Color from './Color/Color';
import AlphaColor from './Color/AlphaColor';
import { DrawPermission } from './Permission';

// State class use as a singleton to share drawing state
class DrawState {
  color: Color;
  opacity: number;
  thickness: number;
  shapeType: ShapeType;
  drawPermission: DrawPermission;

  constructor() {
    this.shapeType = ShapeType.Line;
    this.color = new Color(0, 0, 0);
    this.opacity = 1;
    this.thickness = 5;
    this.drawPermission = DrawPermission.All;
  }

  getAlphaColor(): AlphaColor {
    return new AlphaColor(this.color.red, this.color.green, this.color.blue, this.opacity * 255);
  }
}

const drawState = new DrawState();
export default drawState;

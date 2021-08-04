import drawState from './DrawState';
import ShapeFactory from './ShapeFacory';
import Point from './Point';
import canvas from './Canvas';
import Shape from './Shape';

class ShapeManager {
  currentShape : Shape | null;
  shapes : Array<Shape>;
  undoShapes : Array<Shape>;

  constructor() {
    this.currentShape = null;
    this.shapes = [];
    this.undoShapes = [];
  }

  beginShape(event: MouseEvent) : void {
    drawState.isDrawing = true;
    drawState.basePoint = new Point(event.clientX, event.clientY);
  }

  updateShape(event: MouseEvent) : void {
    if(!drawState.isDrawing) return;
    if(this.currentShape === null) {
      this.currentShape = ShapeFactory.create(drawState.shapeType);
    }
    this.currentShape?.update(event);
  }
  
  endShape() : void {
    drawState.isDrawing = false;
    if(this.currentShape === null) return;
    this.shapes.push(this.currentShape);
    // emit shape... // event listener ?
    this.currentShape = null;
    this.undoShapes = [];
  }

  undo() : void {
    this.endShape();
    canvas.clearCanvas();
    const shape : Shape | undefined = this.shapes.pop();
    if (shape !== undefined) {
      this.undoShapes.push(shape);
    }
    this.shapes.forEach((shape) => shape.draw(0))
  }

  redo() : void {
    this.endShape();
    const shape : Shape | undefined = this.undoShapes.pop();
    if (shape !== undefined) {
      shape.draw(100);
      this.shapes.push(shape);
    }
  }
}

export default new ShapeManager();
import type Shape from './Shapes/Shape';
import drawState from './DrawState';
import Point from './Point';
import canvas from './Canvas';
import ShapeFactory from './ShapeFactory';
import DraggableShape from './Shapes/DraggableShape';

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
    if (!(this.currentShape instanceof DraggableShape)) {
      this.createShape();
      this.currentShape?.update(event, this);
    }
  }

  updateShape(event: MouseEvent) : void {
    if (!drawState.isDrawing) return;
    if (this.currentShape === null) {
      this.createShape();
    }
    this.currentShape?.update(event, this);
  }

  private createShape() {
    this.currentShape = ShapeFactory.create(drawState.shapeType);
  }

  endShape() : void {
    drawState.isDrawing = false;
    if (this.currentShape === null) return;
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
    this.redrawShapes();
  }

  redrawShapes() : void {
    this.shapes.forEach((shp) => shp.draw(0, this));
  }

  async redo() : Promise<void> {
    this.endShape();
    const shape : Shape | undefined = this.undoShapes.pop();
    if (shape !== undefined) {
      await shape.draw(100, this);
      this.shapes.push(shape);
    }
  }
}

const shapeManager = new ShapeManager();
export { shapeManager, ShapeManager };

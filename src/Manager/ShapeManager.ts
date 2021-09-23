import AbstractDo from './AbstractDo';
import ShapeInfo from '../Shapes/ShapeInfo';
import Line from '../Shapes/Line';
import Fill from '../Shapes/Fill';
import ActionType from '../Action/ActionType';
import type Shape from '../Shapes/Shape';
import Point from '../Point';
import canvas from '../Canvas';
import ShapeFactory from '../Shapes/ShapeFactory';
import DraggableShape from '../Shapes/DraggableShape';
import UpdatableShape from '../Shapes/UpdatableShape';
import Handler from './Handler';
import actionManager from './ActionManager';
import drawState from '../DrawState';

class ShapeManager extends AbstractDo<Shape> implements Handler<ShapeInfo> {
  factory : ShapeFactory = new ShapeFactory();
  currentShape : Shape | null = null;
  basePoint : Point | null = null;
  isDrawing = false;

  beginShape(event: MouseEvent) : void {
    this.isDrawing = true;
    this.basePoint = new Point(event.clientX, event.clientY);

    // We dont want to draw anything if DraggableShape
    if (this.currentShape instanceof DraggableShape) return;

    this.createShape();

    if (this.currentShape instanceof Line) {
      this.currentShape.update(event);
    }

    if (this.currentShape instanceof Fill) {
      this.currentShape?.draw();
    }
  }

  updateShape(event: MouseEvent) : void {
    if (!this.isDrawing) return;

    if (this.currentShape === null) {
      this.createShape();
    }

    if (this.currentShape instanceof UpdatableShape) {
      this.currentShape.update(event, this);
    }
  }

  private createShape() {
    this.currentShape = this.factory.build({
      type: drawState.shapeType,
      parameters: this.basePoint,
    });
  }

  endShape() : void {
    if (this.currentShape === null) return;
    this.dones.push(this.currentShape);

    this.emit(this.factory.serialize(this.currentShape));

    this.currentShape = null;
    this.basePoint = null;
    this.isDrawing = false;
    this.undones = [];
  }

  emit(elem: ShapeInfo): void {
    actionManager.emit({
      type: ActionType.style,
      parameters: elem,
    });
  }

  handle(elem: ShapeInfo): void {
    const shape = this.factory.build(elem);
    this.dones.push(shape);
    shape.draw(this);
  }

  handleUndo(): void {
    canvas.clearCanvas();
    this.redrawShapes();
  }

  redrawShapes() : void {
    this.dones.forEach((shape) => shape.draw(this));
  }

  handleRedo(): void {
    const shapeToRedo = this.dones[this.dones.length - 1];
    shapeToRedo.draw(this);
  }
}

const shapeManager = new ShapeManager();
export { shapeManager, ShapeManager };

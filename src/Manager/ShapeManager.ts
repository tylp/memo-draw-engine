import AbstractDo from './AbstractDo';
import IShapeInfo from '../Shapes/IShapeInfo';
import Fill from '../Shapes/Fill';
import ActionType from '../Action/ActionType';
import type Shape from '../Shapes/Shape';
import Point from '../Point';
import canvas from '../Canvas';
import ShapeFactory from '../Shapes/ShapeFactory';
import DraggableShape from '../Shapes/DraggableShape';
import UpdatableShape from '../Shapes/UpdatableShape';
import Observer from '../Observer/IObserver';
import drawState from '../DrawState';
import Draw from '../Shapes/Draw';
import IAction from '../Action/IAction';
import ICanvasEventHandlder from './ICanvasEventHandlder';

class ShapeManager extends AbstractDo<Shape> implements Observer<IAction>, ICanvasEventHandlder {
  factory : ShapeFactory = new ShapeFactory();
  currentShape : Shape | null = null;
  basePoint : Point | null = null;
  isDrawing = false;

  down(point : Point) : void {
    this.isDrawing = true;
    this.basePoint = point;

    // We dont want to draw anything if DraggableShape
    if (this.currentShape instanceof DraggableShape) return;

    this.createShape();

    // Update on create to draw single point
    if (this.currentShape instanceof Draw) {
      this.currentShape.update(point);
    }

    if (this.currentShape instanceof Fill) {
      this.currentShape?.draw();
    }
  }

  move(event: MouseEvent) : void {
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

  up() : void {
    if (this.currentShape === null) return;
    this.dones.push(this.currentShape);

    this.emit(this.factory.serialize(this.currentShape));

    this.currentShape = null;
    this.basePoint = null;
    this.isDrawing = false;
    this.undones = [];
  }

  emit(elem: IShapeInfo): void {
    this.notify({
      type: ActionType.style,
      parameters: elem,
    });
  }

  update(elem: IAction): void {
    const shapeInfo = elem.parameters as IShapeInfo;
    const shape = this.factory.build(shapeInfo);
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

export default ShapeManager;

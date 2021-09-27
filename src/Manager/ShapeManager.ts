import IShapeInfo from '../Shapes/IShapeInfo';
import type Shape from '../Shapes/Shape';
import Point from '../Point';
import canvas from '../Canvas';
import ShapeFactory from '../Shapes/ShapeFactory';
import DraggableShape from '../Shapes/DraggableShape';
import UpdatableShape from '../Shapes/UpdatableShape';
import IObserver from '../Observer/IObserver';
import drawState from '../DrawState';
import Draw from '../Shapes/Draw';
import ICanvasEventHandlder from './ICanvasEventHandlder';
import AbstractObservable from '../Observer/AbstractObservable';
import IAction from '../Action/IAction';
import ActionType from '../Action/ActionType';
import IDocumentEventHandler from './IDocumentEventHandler';

// eslint-disable-next-line max-len
class ShapeManager extends AbstractObservable<IAction> implements IObserver<IAction>, ICanvasEventHandlder, IDocumentEventHandler {
  factory : ShapeFactory = new ShapeFactory();
  shapes : Array<Shape> = [];
  undoShapes : Array<Shape> = [];
  currentShape : Shape | null = null;
  basePoint : Point | null = null;
  isDrawing = false;

  drawBegin(point : Point) : void {
    this.isDrawing = true;
    this.basePoint = point;

    // We dont want to draw anything if DraggableShape
    if (this.currentShape instanceof DraggableShape) return;

    this.createShape();

    if (!(this.currentShape instanceof UpdatableShape)) {
      this.currentShape?.draw(this);
    } else if (this.currentShape !== null) {
      // Set style for new shape if the shape is not directly draw
      canvas.setStyle(this.currentShape.color, this.currentShape.thickness);
    }

    // Update on create to draw single point
    if (this.currentShape instanceof Draw) {
      this.currentShape.update(point);
    }
  }

  drawMove(event: MouseEvent) : void {
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

  drawFinish() : void {
    if (this.currentShape === null) return;
    this.shapes.push(this.currentShape);

    this.emit();

    this.currentShape = null;
    this.basePoint = null;
    this.isDrawing = false;
    this.undoShapes = [];
  }

  emit() : void {
    if (this.currentShape === null) return;
    this.notify({
      type: ActionType.shape,
      parameters: this.factory.serialize(this.currentShape),
    });
  }

  update(action: IAction): void {
    switch (action.type) {
      case ActionType.undo:
        this.undo(); break;
      case ActionType.redo:
        this.redo(); break;
      case ActionType.shape:
        this.addShapeFromShapeInfo(action.parameters as IShapeInfo);
        break;
      default: break;
    }
  }

  addShapeFromShapeInfo(shapeInfo : IShapeInfo) : void {
    const shape = this.factory.build(shapeInfo);
    this.shapes.push(shape);
    shape.draw(this);
  }

  undo() : void {
    this.drawFinish();
    canvas.clearCanvas();
    const shape : Shape | undefined = this.shapes.pop();
    if (shape !== undefined) {
      this.undoShapes.push(shape);
    }
    this.redrawShapes();
  }

  async redo() : Promise<void> {
    this.drawFinish();
    const shape : Shape | undefined = this.undoShapes.pop();
    if (shape !== undefined) {
      await shape.draw(this);
      this.shapes.push(shape);
    }
  }

  redrawShapes() : void {
    this.shapes.forEach((shp) => shp.draw(this));
  }
}

export default ShapeManager;

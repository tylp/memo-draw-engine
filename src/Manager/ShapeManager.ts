import IFactory from '../Shapes/IFactory';
import ShapeFactory from '../Shapes/ShapeFactory';
import IShapeInfo from '../Shapes/IShapeInfo';
import type Shape from '../Shapes/Shape';
import Point from '../Point';
import DraggableShape from '../Shapes/DraggableShape';
import UpdatableShape from '../Shapes/UpdatableShape';
import IObserver from '../Observer/IObserver';
import drawState from '../DrawState';
import Pencil from '../Shapes/Pencil';
import AbstractObservable from '../Observer/AbstractObservable';
import IAction from '../Action/IAction';
import ActionType from '../Action/ActionType';
import Canvas from '../Canvas';
import ShapeType from '../Shapes/ShapeType';
import Fill from '../Shapes/Fill';
import ShapeEventManager from './ShapeEventManager';
import AnimationQueue from './AnimationQueue';

class ShapeManager extends AbstractObservable<IAction> implements IObserver<IAction> {
  animationQueue: AnimationQueue = new AnimationQueue();
  internalEventManager: ShapeEventManager = new ShapeEventManager(this);
  factory: IFactory<IShapeInfo, Shape> = new ShapeFactory();
  shapes: Array<Shape> = [];
  undoShapes: Array<Shape> = [];
  currentShape: Shape | null = null;
  basePoint: Point | null = null;
  lastImageData: ImageData | null = null;
  canvas: Canvas;

  constructor(canvas: Canvas) {
    super();
    this.canvas = canvas;
  }

  drawBegin(point: Point): void {
    this.basePoint = point;

    // We dont want to draw anything if DraggableShape
    if (this.currentShape instanceof DraggableShape) return;

    this.createShape();

    if (!(this.currentShape instanceof UpdatableShape)) {
      this.currentShape?.draw(this.canvas, false);
    } else if (this.currentShape !== null) {
      // Set style for new shape if the shape is not directly draw
      this.canvas.setStyle(this.currentShape.color, this.currentShape.thickness);
    }

    // Update on create to draw single point
    if (this.currentShape instanceof Pencil) {
      this.currentShape.update(point, this.canvas);
    }
  }

  drawMove(point: Point): void {
    if (this.currentShape === null) {
      this.createShape();
    }

    if (this.currentShape instanceof UpdatableShape) {
      this.currentShape.update(point, this.canvas);
    }

    // Handle Pencil pre-emit for real-time draw
    if (this.currentShape instanceof Pencil && this.currentShape.shouldPreEmit()) {
      this.currentShape.resetForPreEmit();
      this.emit();
    }
  }

  private createShape() {
    this.currentShape = this.factory.build({
      type: drawState.shapeType,
      parameters: this.basePoint,
    });
  }

  drawFinish(): void {
    if (this.currentShape === null) return;

    if (this.currentShape instanceof UpdatableShape) {
      this.currentShape.endDate = Date.now();
    }

    if (!(this.currentShape instanceof Fill && this.currentShape.dismissed)) {
      this.shapes.push(this.currentShape);
      this.canvas.storeLast();
      this.emit();
    }

    this.currentShape = null;
    this.basePoint = null;
    this.undoShapes = [];
  }

  emit(): void {
    if (this.currentShape === null) return;
    this.notify({
      type: ActionType.draw,
      parameters: this.currentShape.serialize(),
    });
  }

  update(action: IAction): void {
    switch (action.type) {
      case ActionType.undo:
        this.undo(); break;
      case ActionType.redo:
        this.redo(); break;
      case ActionType.draw:
        this.addShapeFromShapeInfo(action.parameters as IShapeInfo);
        break;
      default: break;
    }
  }

  async addShapeFromShapeInfo(shapeInfo: IShapeInfo): Promise<void> {
    if (this.tryMergePencil(shapeInfo)) return;
    const shape = this.factory.build(shapeInfo);
    this.shapes.push(shape);
    await this.animationQueue.add(async () => {
      await shape.draw(this.canvas, true);
      this.canvas.storeLast();
    });
  }

  // Do not create a new pencil if the shape sent is a continuation of an existing pencil
  // Merge it with the existing pencil instead
  private tryMergePencil(shapeInfo: IShapeInfo): boolean {
    if (shapeInfo.type !== ShapeType.Pencil) return false;
    if (this.shapes.length === 0) return false;

    const lastShape = this.shapes[this.shapes.length - 1];

    if (!(lastShape instanceof Pencil)) return false;
    if (lastShape.startDate !== shapeInfo.parameters.startDate) return false;

    this.animationQueue.add(async () => {
      await lastShape.mergePoints(shapeInfo.parameters.points, shapeInfo.parameters.endDate, this.canvas);
      this.canvas.storeLast();
    });
    return true;
  }

  undo(): void {
    this.drawFinish();
    this.canvas.clearCanvas();
    const shape: Shape | undefined = this.shapes.pop();
    if (shape !== undefined) {
      this.undoShapes.push(shape);
    }
    this.redrawShapes();
    this.canvas.storeLast();
  }

  async redo(): Promise<void> {
    this.drawFinish();
    const shape: Shape | undefined = this.undoShapes.pop();
    if (shape !== undefined) {
      await shape.draw(this.canvas, false);
      this.shapes.push(shape);
      this.canvas.storeLast();
    }
  }

  public redrawShapes(): void {
    this.shapes.forEach((shp) => shp.draw(this.canvas, false));
  }
}

export default ShapeManager;

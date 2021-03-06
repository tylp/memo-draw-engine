import ShapeFactory from '../Shapes/ShapeFactory';
import IShapeInfo from '../Shapes/IShapeInfo';
import type Shape from '../Shapes/Shape';
import Point from '../Point';
import DraggableShape from '../Shapes/DraggableShape';
import UpdatableShape from '../Shapes/UpdatableShape';
import IObserver from '../Observer/IObserver';
import Pencil from '../Shapes/Pencil';
import AbstractObservable from '../Observer/AbstractObservable';
import IAction from '../Action/IAction';
import ActionType from '../Action/ActionType';
import ShapeType from '../Shapes/ShapeType';
import Fill from '../Shapes/Fill';
import ShapeEventManager from './ShapeEventManager';
import AnimationManager from './AnimationManager';
import UndoRedoManager from './UndoRedoManager';
import CanvasManager from './CanvasManager';
import DrawState from '../DrawState';

class ShapeManager extends AbstractObservable<IAction> implements IObserver<IAction> {
  animationManager: AnimationManager = new AnimationManager();
  internalEventManager: ShapeEventManager = new ShapeEventManager(this);
  undoRedoManager: UndoRedoManager = new UndoRedoManager(this);
  basePoint: Point | null = null;
  canvasManager: CanvasManager;
  private currentShape: Shape | null = null;
  private drawState: DrawState;
  private factory: ShapeFactory;

  constructor(canvasManager: CanvasManager, drawState: DrawState) {
    super();
    this.canvasManager = canvasManager;
    this.drawState = drawState;
    this.factory = new ShapeFactory(drawState);
  }

  update(action: IAction): void {
    switch (action.type) {
      case ActionType.Draw:
        this.addShapeFromShapeInfo(action.parameters as IShapeInfo);
        break;
      case ActionType.Reset:
        this.reset();
        break;
      default: break;
    }
  }

  async addShapeFromShapeInfo(shapeInfo: IShapeInfo): Promise<void> {
    if (this.tryMergePencil(shapeInfo)) return;
    const shape = this.factory.build(shapeInfo);
    await this.animationManager.add(async () => {
      this.undoRedoManager.addShape(shape);
      await this.animationManager.animateDrawShape(shape, this.canvasManager.backgroundCanvas);
      this.canvasManager.backgroundCanvas.storeLast();
    });
  }

  // Do not create a new pencil if the shape sent is a continuation of an existing pencil
  // Merge it with the existing pencil instead
  private tryMergePencil(shapeInfo: IShapeInfo): boolean {
    if (shapeInfo.type !== ShapeType.Pencil) return false;

    const lastShape = this.undoRedoManager.getLastShape();
    if (lastShape === undefined) return false;

    if (!(lastShape instanceof Pencil)) return false;
    if (lastShape.id !== shapeInfo.parameters.id) return false;

    this.animationManager.add(async () => {
      await lastShape.mergePoints(
        shapeInfo.parameters.points,
        shapeInfo.parameters.endDate,
        this.canvasManager.backgroundCanvas,
        this.animationManager,
      );
      this.canvasManager.backgroundCanvas.storeLast();
    });
    return true;
  }

  drawBegin(point: Point): void {
    this.basePoint = point;

    // We dont want to draw anything if DraggableShape
    if (this.currentShape instanceof DraggableShape) return;

    this.createShape();

    if (!(this.currentShape instanceof UpdatableShape)) {
      const { currentShape } = this;
      this.animationManager.add(() => {
        currentShape?.draw(this.canvasManager.backgroundCanvas);
        this.canvasManager.backgroundCanvas.storeLast();
        return Promise.resolve();
      });
    } else if (this.currentShape !== null) {
      // Set style for new shape if the shape is not directly draw
      this.canvasManager.userCanvas.setStyle(this.currentShape.color, this.currentShape.thickness);
    }

    // Update on create to draw single point
    if (this.currentShape instanceof Pencil) {
      this.currentShape.update(point, this.canvasManager.userCanvas);
    }
  }

  drawMove(point: Point): void {
    if (this.currentShape === null) {
      this.createShape();
    }

    if (this.currentShape instanceof UpdatableShape) {
      this.currentShape.update(point, this.canvasManager.userCanvas);
    }

    // Handle Pencil pre-emit for real-time draw
    if (this.currentShape instanceof Pencil && this.currentShape.shouldPreEmit()) {
      this.currentShape.resetForPreEmit();
      this.emit();
    }
  }

  private createShape() {
    this.currentShape = this.factory.build({
      type: this.drawState.shapeType,
      parameters: this.basePoint,
    });
  }

  drawFinish(): void {
    if (this.currentShape === null) return;

    if (this.currentShape instanceof UpdatableShape) {
      this.currentShape.endDate = Date.now();
    }

    // If shape was not dismissed
    if (!(this.currentShape instanceof Fill && this.currentShape.dismissed)) {
      // If shape is UpdatableShape draw on background canvas
      if (this.currentShape instanceof UpdatableShape) {
        this.drawCurrentShapeToBackground();
      }

      this.undoRedoManager.addShape(this.currentShape);
      this.emit();
    }

    this.currentShape = null;
    this.basePoint = null;
    this.undoRedoManager.resetCreatedRedo();
  }

  // Draw the current shape (drawn on the main canvas) to the background canvas
  // Use animation queue to not override currents animation
  // Store main canvas to persist not already backgrouded shapes
  drawCurrentShapeToBackground(): void {
    if (this.currentShape === null) return;
    // Store main canvas while animation queue
    this.canvasManager.userCanvas.storeLast();
    // Wait last animation end before add to background
    const shape = this.currentShape;
    this.animationManager.add(async () => {
      shape.draw(this.canvasManager.backgroundCanvas);
      this.canvasManager.backgroundCanvas.storeLast();
    }).then(() => {
      // Reset main canvas when animation queue finished
      this.canvasManager.userCanvas.clearCanvas();
      this.canvasManager.userCanvas.storeLast();
    });
  }

  emit(): void {
    if (this.currentShape === null) return;
    this.notify({
      type: ActionType.Draw,
      parameters: this.currentShape.serialize(),
    });
  }

  private reset(): void {
    this.internalEventManager.reset();
    this.animationManager.reset();
    this.currentShape = null;
    this.basePoint = null;
    this.undoRedoManager.reset();
    this.canvasManager.reset();
  }
}

export default ShapeManager;

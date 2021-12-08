import type ShapeManager from './ShapeManager';
import ICanvasEventHandlder from './ICanvasEventHandlder';
import IDocumentEventHandler from './IDocumentEventHandler';
import Point from '../Point';
import IWindowEventHandler from './IWindowEventHandler';

class ShapeEventManager implements ICanvasEventHandlder, IDocumentEventHandler, IWindowEventHandler {
  shapeManager: ShapeManager;
  isDrawing = false;

  constructor(shapeManager: ShapeManager) {
    this.shapeManager = shapeManager;
  }

  public canvasDown(point: Point): void {
    this.isDrawing = true;
    this.shapeManager.drawBegin(point);
  }

  public documentUp(): void {
    if (this.isDrawing) this.drawFinish();
  }

  public documentMove(point: Point): void {
    if (this.isDrawing) {
      this.shapeManager.drawMove(point);
    }
  }

  public drawFinish(): void {
    this.isDrawing = false;
    this.shapeManager.drawFinish();
  }

  public undo(): void {
    this.isDrawing = false;
    this.shapeManager.undoRedoManager.undo();
  }

  public redo(): void {
    this.isDrawing = false;
    this.shapeManager.undoRedoManager.redo();
  }

  public reset(): void {
    this.isDrawing = false;
  }

  resize(): void {
    this.shapeManager.canvasManager.recalculateDimensions();
    this.shapeManager.animationManager.stop();
    this.shapeManager.canvasManager.reset();
    this.shapeManager.undoRedoManager.clearCacheFromFillShape();
    this.shapeManager.undoRedoManager.redrawShapes();
    this.shapeManager.canvasManager.backgroundCanvas.storeLast();
  }

  // Do nothing
  scroll(): void { }
}

export default ShapeEventManager;

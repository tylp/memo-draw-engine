import type ShapeManager from './ShapeManager';
import ICanvasEventHandlder from './ICanvasEventHandlder';
import IDocumentEventHandler from './IDocumentEventHandler';
import Point from '../Point';

class ShapeEventManager implements ICanvasEventHandlder, IDocumentEventHandler {
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
}

export default ShapeEventManager;

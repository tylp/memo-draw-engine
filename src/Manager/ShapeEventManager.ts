import type ShapeManager from './ShapeManager';
import ICanvasEventHandlder from './ICanvasEventHandlder';
import IDocumentEventHandler from './IDocumentEventHandler';
import Point from '../Point';

class ShapeEventManager implements ICanvasEventHandlder, IDocumentEventHandler {
  shapeManager: ShapeManager;
  isDrawing = false;
  didLeave = false;

  constructor(shapeManager: ShapeManager) {
    this.shapeManager = shapeManager;
  }

  mouseDown(point: Point): void {
    this.isDrawing = true;
    this.shapeManager.drawBegin(point);
  }

  mouseMove(point: Point): void {
    if (this.isDrawing) {
      this.didLeave = false;
      this.shapeManager.drawMove(point);
    }
  }

  mouseLeave(): void {
    this.didLeave = true;
  }

  mouseUp(): void {
    this.isDrawing = false;
    this.shapeManager.drawFinish();
  }

  undo(): void {
    this.isDrawing = false;
    this.shapeManager.undo();
  }

  redo(): void {
    this.isDrawing = false;
    this.shapeManager.redo();
  }

  documentMouseUp(): void {
    if (this.didLeave) {
      this.isDrawing = false;
      this.shapeManager.drawFinish();
    }
  }
}

export default ShapeEventManager;

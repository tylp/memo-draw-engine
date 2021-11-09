import ActionType from '../Action/ActionType';
import Shape from '../Shapes/Shape';
import type ShapeManager from './ShapeManager';

type UndoOrRedo = ActionType.undo | ActionType.redo;

class UndoRedoManager {
  private shapes: Array<Shape> = [];
  private undoShapes: Array<Shape> = [];
  private shapeManager: ShapeManager;

  constructor(shapeManager: ShapeManager) {
    this.shapeManager = shapeManager;
  }

  public addShape(shape: Shape): void {
    this.shapes.push(shape);
  }

  public resetCreatedRedo(): void {
    this.undoShapes = this.undoShapes.filter((shape) => !shape.created);
  }

  public getLastShape(): Shape | undefined {
    if (this.shapes.length === 0) return undefined;
    return this.shapes[this.shapes.length - 1];
  }

  public undo(): void {
    this.shapeManager.drawFinish();
    const shape: Shape | undefined = UndoRedoManager.popLastCreated(this.shapes);
    if (shape !== undefined) {
      this.emit(ActionType.undo, shape);
      this.applyUndo(shape);
    }
  }

  public externalUndo(id: string): void {
    const shape: Shape = this.getAndRemove(this.shapes, id);
    this.shapeManager.animationQueue.add(() => {
      this.applyUndo(shape);
      return Promise.resolve();
    });
  }

  public redo(): void {
    this.shapeManager.drawFinish();
    const shape: Shape | undefined = UndoRedoManager.popLastCreated(this.undoShapes);
    if (shape !== undefined) {
      this.emit(ActionType.redo, shape);
      this.applyRedo(shape);
    }
  }

  public externalRedo(id: string): void {
    const shape: Shape = this.getAndRemove(this.undoShapes, id);
    this.shapeManager.animationQueue.add(() => {
      this.applyRedo(shape);
      return Promise.resolve();
    });
  }

  // /!\ Mutating function
  private static popLastCreated(shapes: Array<Shape>): Shape | undefined {
    for (let i = shapes.length - 1; i >= 0; i -= 1) {
      if (shapes[i].created) {
        const shape = shapes[i];
        shapes.splice(i, 1);
        return shape;
      }
    }
    return undefined;
  }

  // /!\ Mutating function
  private getAndRemove(shapes: Array<Shape>, id: string) {
    for (let i = shapes.length - 1; i >= 0; i -= 1) {
      if (shapes[i].id === id) {
        const shape = shapes[i];
        shapes.splice(i, 1);
        return shape;
      }
    }
    throw new Error(`Shape (id:${id}) doesn't exist`);
  }

  private applyUndo(shape: Shape) {
    this.shapeManager.canvas.backgroundCanvas.clearCanvas();
    this.undoShapes.push(shape);
    this.redrawShapes();
    this.shapeManager.canvas.backgroundCanvas.storeLast();
  }

  private applyRedo(shape: Shape) {
    shape.draw(this.shapeManager.canvas.backgroundCanvas, false);
    this.shapes.push(shape);
    this.shapeManager.canvas.backgroundCanvas.storeLast();
  }

  private redrawShapes(): void {
    this.shapes.forEach(
      (shp) => shp.draw(this.shapeManager.canvas.backgroundCanvas, false),
    );
  }

  private emit(type: UndoOrRedo, shape: Shape) {
    this.shapeManager.notify({
      type,
      parameters: shape.id,
    });
  }
}

export default UndoRedoManager;

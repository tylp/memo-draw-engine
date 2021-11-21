import IObserver from '../Observer/IObserver';
import ActionType from '../Action/ActionType';
import IAction from '../Action/IAction';
import Shape from '../Shapes/Shape';
import type ShapeManager from './ShapeManager';

type UndoOrRedo = ActionType.Undo | ActionType.Redo;

class UndoRedoManager implements IObserver<IAction> {
  private shapes: Array<Shape> = [];
  private undoShapes: Array<Shape> = [];
  private shapeManager: ShapeManager;

  constructor(shapeManager: ShapeManager) {
    this.shapeManager = shapeManager;
  }

  update(action: IAction): void {
    switch (action.type) {
      case ActionType.Undo:
        this.externalUndo(action.parameters as string);
        break;
      case ActionType.Redo:
        this.externalRedo(action.parameters as string);
        break;
      default: break;
    }
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
      this.emit(ActionType.Undo, shape);
      this.applyUndo(shape);
    }
  }

  public externalUndo(id: string): void {
    const shape: Shape = this.getAndRemove(this.shapes, id);
    this.shapeManager.animationManager.add(() => {
      this.applyUndo(shape);
      return Promise.resolve();
    });
  }

  public redo(): void {
    this.shapeManager.drawFinish();
    const shape: Shape | undefined = UndoRedoManager.popLastCreated(this.undoShapes);
    if (shape !== undefined) {
      this.emit(ActionType.Redo, shape);
      this.applyRedo(shape);
    }
  }

  public externalRedo(id: string): void {
    const shape: Shape = this.getAndRemove(this.undoShapes, id);
    this.shapeManager.animationManager.add(() => {
      this.applyRedo(shape);
      return Promise.resolve();
    });
  }

  // /!\ Mutating function
  private static popLastCreated(shapes: Array<Shape>): Shape | undefined {
    for (let i = shapes.length - 1; i >= 0; i -= 1) {
      if (shapes[i].created) {
        return shapes.splice(i, 1)[0];
      }
    }
    return undefined;
  }

  // /!\ Mutating function
  private getAndRemove(shapes: Array<Shape>, id: string) {
    for (let i = shapes.length - 1; i >= 0; i -= 1) {
      if (shapes[i].id === id) {
        return shapes.splice(i, 1)[0];
      }
    }
    throw new Error(`Shape (id:${id}) doesn't exist`);
  }

  private applyUndo(shape: Shape) {
    this.shapeManager.canvasManager.backgroundCanvas.clearCanvas();
    this.undoShapes.push(shape);
    this.redrawShapes();
    this.shapeManager.canvasManager.backgroundCanvas.storeLast();
  }

  private applyRedo(shape: Shape) {
    shape.draw(this.shapeManager.canvasManager.backgroundCanvas);
    this.shapes.push(shape);
    this.shapeManager.canvasManager.backgroundCanvas.storeLast();
  }

  private redrawShapes(): void {
    this.shapes.forEach(
      (shp) => shp.draw(this.shapeManager.canvasManager.backgroundCanvas),
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

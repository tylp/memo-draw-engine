import shapeManager from './ShapeManager';

class EventManager {
  static registerEvents(canvasElement: HTMLCanvasElement) : void {
    this.registerCanvasEvents(canvasElement);
    this.registerDocumentEvents();
  }

  private static registerCanvasEvents(canvasElement: HTMLCanvasElement) : void {
    canvasElement.addEventListener('mousemove', (event : MouseEvent) => shapeManager.updateShape(event));
    canvasElement.addEventListener('mousedown', (event : MouseEvent) => shapeManager.beginShape(event));
    canvasElement.addEventListener('mouseup', () => shapeManager.endShape());
    canvasElement.addEventListener('mouseleave', () => shapeManager.endShape());
  }

  private static registerDocumentEvents() : void {
    this.registerUndoEvent();
    this.registerRedoEvent();
  }

  private static registerUndoEvent() : void {
    document.addEventListener('keydown', (event : KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'z') {
        shapeManager.undo();
      }
    });
  }

  private static registerRedoEvent() : void {
    document.addEventListener('keydown', (event : KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'y') {
        shapeManager.redo();
      }
    });
  }
}

export default EventManager;

import shapeManager from './ShapeManager';
import canvas from './Canvas';

class EventManager {
  static registerEvents() : void {
    canvas.registerEvents();
    this.registerDocumentEvents();
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
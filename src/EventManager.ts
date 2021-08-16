import { shapeManager } from './ShapeManager';

class EventManager {
  static registerEvents(canvasElement: HTMLCanvasElement) : void {
    this.registerCanvasEvents(canvasElement);
    this.registerDocumentEvents();
  }

  private static registerCanvasEvents(canvasElement: HTMLCanvasElement) : void {
    canvasElement.addEventListener(
      'mousemove',
      (event : MouseEvent) => {
        const relEvent = this.getRelativeEvent(canvasElement, event);
        shapeManager.updateShape(relEvent);
      },
    );

    canvasElement.addEventListener(
      'mousedown',
      (event : MouseEvent) => {
        const relEvent = this.getRelativeEvent(canvasElement, event);
        shapeManager.beginShape(relEvent);
      },
    );

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

  private static getRelativeEvent(canvasEl: HTMLCanvasElement, event: MouseEvent) : MouseEvent {
    return {
      clientX: event.clientX - canvasEl.offsetLeft,
      clientY: event.clientY - canvasEl.offsetTop,
      ...event,
    };
  }
}

export default EventManager;

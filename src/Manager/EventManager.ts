import { shapeManager } from './ShapeManager';

class EventManager {
  static canvasElement: HTMLCanvasElement;

  static registerEvents(canvasElement: HTMLCanvasElement) : void {
    this.canvasElement = canvasElement;
    this.registerCanvasEvents();
    this.registerDocumentEvents();
  }

  private static registerCanvasEvents() : void {
    this.canvasElement.addEventListener('mousemove', (event) => this.onMouseMove(event));
    this.canvasElement.addEventListener('mousedown', (event) => this.onMouseDown(event));
    this.canvasElement.addEventListener('mouseup', () => shapeManager.endShape());
    this.canvasElement.addEventListener('mouseleave', () => shapeManager.endShape());
  }

  private static onMouseMove(event : MouseEvent) : void {
    const relEvent = this.getRelativeEvent(event);
    shapeManager.updateShape(relEvent);
  }

  private static onMouseDown(event : MouseEvent): void {
    const relEvent = this.getRelativeEvent(event);
    shapeManager.beginShape(relEvent);
  }

  private static getRelativeEvent(event: MouseEvent) : MouseEvent {
    return {
      clientX: event.clientX - this.canvasElement.offsetLeft,
      clientY: event.clientY - this.canvasElement.offsetTop,
      ...event,
    };
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

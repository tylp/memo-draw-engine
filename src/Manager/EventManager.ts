import Point from '../Point';
import ICanvasEventHandlder from './ICanvasEventHandlder';
import IDocumentEventHandler from './IDocumentEventHandler';

class EventManager {
  private canvasEventHandlers: Array<ICanvasEventHandlder> = [];
  private documentEventHandlers: Array<IDocumentEventHandler> = [];
  private canvasElement: HTMLCanvasElement;

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvasElement = canvasElement;
  }

  subscribeCanvasEventHandler(handler: ICanvasEventHandlder): void {
    this.canvasEventHandlers.push(handler);
  }

  subscribeDocumentEventHandler(handler: IDocumentEventHandler): void {
    this.documentEventHandlers.push(handler);
  }

  public registerDefaultCanvasAndDocumentEvents(): void {
    this.registerCanvasEvents();
    this.registerDocumentEvents();
  }

  private registerCanvasEvents(): void {
    this.canvasElement.addEventListener('mousemove', (event) => this.onMouseMove(event));
    this.canvasElement.addEventListener('mousedown', (event) => this.onMouseDown(event));
    this.canvasElement.addEventListener('mouseup', () => this.onMouseUp());
    this.canvasElement.addEventListener('mouseleave', () => this.onMouseUp());
  }

  private onMouseMove(event: MouseEvent): void {
    const point = this.getNewPoint(event);
    this.canvasEventHandlers.forEach((handler) => handler.drawMove(point));
  }

  private onMouseDown(event: MouseEvent): void {
    const point = this.getNewPoint(event);
    this.canvasEventHandlers.forEach((handler) => handler.drawBegin(point));
  }

  private onMouseUp(): void {
    this.canvasEventHandlers.forEach((handler) => handler.drawFinish());
  }

  private getNewPoint(event: MouseEvent): Point {
    return new Point(
      event.clientX - this.canvasElement.offsetLeft,
      event.clientY - this.canvasElement.offsetTop,
    );
  }

  private registerDocumentEvents(): void {
    this.registerUndoEvent();
    this.registerRedoEvent();
  }

  private registerUndoEvent(): void {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'z') {
        this.documentEventHandlers.forEach((handler) => handler.undo());
      }
    });
  }

  private registerRedoEvent(): void {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'y') {
        this.documentEventHandlers.forEach((handler) => handler.redo());
      }
    });
  }
}

export default EventManager;

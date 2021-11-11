import { DrawPermission } from '../Permission';
import drawState from '../DrawState';
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
    this.canvasElement.addEventListener('mouseleave', () => this.onMouseLeave());
  }

  private onMouseMove(event: MouseEvent): void {
    if (drawState.drawPermission === DrawPermission.Slave) return;
    const point = this.getNewPoint(event);
    this.canvasEventHandlers.forEach((handler) => handler.mouseMove(point));
  }

  private onMouseDown(event: MouseEvent): void {
    if (drawState.drawPermission === DrawPermission.Slave) return;
    const point = this.getNewPoint(event);
    this.canvasEventHandlers.forEach((handler) => handler.mouseDown(point));
  }

  private onMouseUp(): void {
    if (drawState.drawPermission === DrawPermission.Slave) return;
    this.canvasEventHandlers.forEach((handler) => handler.mouseUp());
  }

  private onMouseLeave(): void {
    if (drawState.drawPermission === DrawPermission.Slave) return;
    this.canvasEventHandlers.forEach((handler) => handler.mouseLeave());
  }

  private registerDocumentEvents(): void {
    this.registerUndoEvent();
    this.registerRedoEvent();
    document.addEventListener('mouseup', (event) => this.documentMouseUp(event));
    document.addEventListener('mousemove', (event) => this.documentMouseMove(event));
  }

  private registerUndoEvent(): void {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (drawState.drawPermission === DrawPermission.Slave) return;
      if (event.ctrlKey && event.key.toLowerCase() === 'z') {
        this.documentEventHandlers.forEach((handler) => handler.undo());
      }
    });
  }

  private registerRedoEvent(): void {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (drawState.drawPermission === DrawPermission.Slave) return;
      if (event.ctrlKey && event.key.toLowerCase() === 'y') {
        this.documentEventHandlers.forEach((handler) => handler.redo());
      }
    });
  }

  private documentMouseUp(event: MouseEvent): void {
    if (drawState.drawPermission === DrawPermission.Slave) return;
    if (event.target !== this.canvasElement) {
      this.documentEventHandlers.forEach((handler) => handler.documentMouseUp());
    }
  }

  private documentMouseMove(event: MouseEvent): void {
    if (drawState.drawPermission === DrawPermission.Slave) return;
    if (event.target !== this.canvasElement) {
      const point = this.getNewPoint(event);
      this.documentEventHandlers.forEach((handler) => handler.documentMouseMove(point));
    }
  }

  private getNewPoint(event: MouseEvent): Point {
    return new Point(
      event.clientX - this.canvasElement.offsetLeft,
      event.clientY - this.canvasElement.offsetTop,
    );
  }
}

export default EventManager;

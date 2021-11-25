import { DrawPermission } from '../Permission';
import drawState from '../DrawState';
import Point from '../Point';
import ICanvasEventHandlder from './ICanvasEventHandlder';
import IDocumentEventHandler from './IDocumentEventHandler';
import CanvasManager from './CanvasManager';
import IWindowEventHandler from './IWindowEventHandler';

const MOUSE_EVENT_LEFT = 0;

class EventManager {
  private canvasEventHandlers: Array<ICanvasEventHandlder> = [];
  private documentEventHandlers: Array<IDocumentEventHandler> = [];
  private windowEventHandlers: Array<IWindowEventHandler> = [];
  private canvasManager: CanvasManager;

  constructor(canvasManager: CanvasManager) {
    this.canvasManager = canvasManager;
  }

  subscribeCanvasEventHandler(handler: ICanvasEventHandlder): void {
    this.canvasEventHandlers.push(handler);
  }

  subscribeDocumentEventHandler(handler: IDocumentEventHandler): void {
    this.documentEventHandlers.push(handler);
  }

  subscribeWindowEventHandler(handler: IWindowEventHandler): void {
    this.windowEventHandlers.push(handler);
  }

  public registerDefaultCanvasAndDocumentEvents(): void {
    this.registerCanvasEvents();
    this.registerDocumentEvents();
    this.registerWindowEvent();
  }

  private registerCanvasEvents(): void {
    this.canvasManager.userCanvas.canvasElement.addEventListener('mousemove', (event) => this.onMouseMove(event));
    this.canvasManager.userCanvas.canvasElement.addEventListener('mousedown', (event) => this.onMouseDown(event));
    this.canvasManager.userCanvas.canvasElement.addEventListener('mouseup', () => this.onMouseUp());
    this.canvasManager.userCanvas.canvasElement.addEventListener('mouseleave', () => this.onMouseLeave());
  }

  private onMouseMove(event: MouseEvent): void {
    if (drawState.drawPermission === DrawPermission.Slave) return;
    const point = this.getNewPoint(event);
    this.canvasEventHandlers.forEach((handler) => handler.mouseMove(point));
  }

  private onMouseDown(event: MouseEvent): void {
    if (event.button !== MOUSE_EVENT_LEFT) return;
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
    if (event.target !== this.canvasManager.userCanvas.canvasElement) {
      this.documentEventHandlers.forEach((handler) => handler.documentMouseUp());
    }
  }

  private documentMouseMove(event: MouseEvent): void {
    if (drawState.drawPermission === DrawPermission.Slave) return;
    if (event.target !== this.canvasManager.userCanvas.canvasElement) {
      const point = this.getNewPoint(event);
      this.documentEventHandlers.forEach((handler) => handler.documentMouseMove(point));
    }
  }

  private registerWindowEvent(): void {
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('scroll', () => this.onScroll());
  }

  private onResize(): void {
    this.windowEventHandlers.forEach((handler) => handler.resize());
  }

  private onScroll(): void {
    this.windowEventHandlers.forEach((handler) => handler.scroll());
  }

  private getNewPoint(event: MouseEvent): Point {
    return new Point(
      event.clientX - this.canvasManager.canvasBounds.left,
      event.clientY - this.canvasManager.canvasBounds.top,
    );
  }
}

export default EventManager;

import { DrawPermission } from '../Permission';
import drawState from '../DrawState';
import Point from '../Point';
import ICanvasEventHandlder from './ICanvasEventHandlder';
import IDocumentEventHandler from './IDocumentEventHandler';
import CanvasManager from './CanvasManager';
import IWindowEventHandler from './IWindowEventHandler';

const MOUSE_EVENT_LEFT = 0;

interface XYEvent {
  clientX: number,
  clientY: number,
}

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
    this.canvasManager.userCanvas.canvasElement.addEventListener('mousedown', (event) => this.onMouseDown(event));
    this.canvasManager.userCanvas.canvasElement.addEventListener('touchstart', (event) => this.onTouchStart(event));
  }

  private onMouseDown(event: MouseEvent): void {
    if (event.button !== MOUSE_EVENT_LEFT) return;
    this.onDown(event);
  }

  private onTouchStart(event: TouchEvent): void {
    this.onDown(event.touches[0]);
  }

  private onDown(event: XYEvent): void {
    if (drawState.drawPermission === DrawPermission.Slave) return;
    const point = this.getNewPoint(event);
    this.canvasEventHandlers.forEach((handler) => handler.canvasDown(point));
  }

  private registerDocumentEvents(): void {
    this.registerUndoEvent();
    this.registerRedoEvent();
    document.addEventListener('mouseup', () => this.onDocumentUp());
    document.addEventListener('mousemove', (event) => this.onDocumentMouseMove(event));
    document.addEventListener('touchmove', (event) => this.onDocumentTouchMove(event));
    document.addEventListener('touchend', () => this.onDocumentUp());
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

  private onDocumentUp(): void {
    if (drawState.drawPermission === DrawPermission.Slave) return;
    this.documentEventHandlers.forEach((handler) => handler.documentUp());
  }

  private onDocumentMouseMove(event: MouseEvent): void {
    this.onDocumentMove(event);
  }

  private onDocumentTouchMove(event: TouchEvent) {
    this.onDocumentMove(event.touches[0]);
  }

  private onDocumentMove(event: XYEvent): void {
    if (drawState.drawPermission === DrawPermission.Slave) return;
    const point = this.getNewPoint(event);
    this.documentEventHandlers.forEach((handler) => handler.documentMove(point));
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

  private getNewPoint(event: XYEvent): Point {
    return new Point(
      event.clientX - this.canvasManager.canvasBounds.left,
      event.clientY - this.canvasManager.canvasBounds.top,
    );
  }
}

export default EventManager;

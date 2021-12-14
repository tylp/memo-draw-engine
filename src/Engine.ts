import EventManager from './Manager/EventManager';
import AbstractNetworkManager from './Manager/AbstractNetworkManager';
import ShapeManager from './Manager/ShapeManager';
import CanvasManager from './Manager/CanvasManager';
import PermissionManager from './Manager/PermissionManager';
import ImageManager from './Manager/ImageManager';
import DrawState from './DrawState';

class Engine {
  canvasManager: CanvasManager;
  drawState: DrawState;
  shapeManager: ShapeManager;
  eventManager: EventManager;
  imageManager: ImageManager;
  permissionManager: PermissionManager;
  networkManager: AbstractNetworkManager | null;

  constructor(canvasElement: HTMLCanvasElement, networkManager: AbstractNetworkManager | null = null) {
    this.canvasManager = new CanvasManager(canvasElement);
    this.drawState = new DrawState();
    this.shapeManager = new ShapeManager(this.canvasManager, this.drawState);
    this.eventManager = new EventManager(this.canvasManager, this.drawState);
    this.imageManager = new ImageManager(this.canvasManager);
    this.permissionManager = new PermissionManager(this.shapeManager, this.drawState);
    this.networkManager = networkManager;

    if (networkManager !== null) this.registerNetworkManager(networkManager);
    else this.networkManager = null;

    this.eventManager.subscribeCanvasEventHandler(this.shapeManager.internalEventManager);
    this.eventManager.subscribeDocumentEventHandler(this.shapeManager.internalEventManager);
    this.eventManager.subscribeWindowEventHandler(this.shapeManager.internalEventManager);
    this.eventManager.subscribeWindowEventHandler(this.canvasManager);
  }

  registerNetworkManager(networkManager: AbstractNetworkManager): void {
    this.networkManager = networkManager;
    this.networkManager.subscribe(this.permissionManager);
    this.networkManager.subscribe(this.imageManager);
    this.networkManager.subscribe(this.shapeManager);
    this.networkManager.subscribe(this.shapeManager.undoRedoManager);
    this.shapeManager.subscribe(this.networkManager);
    this.imageManager.subscribe(this.networkManager);
  }
}

export default Engine;

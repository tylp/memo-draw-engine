import EventManager from './Manager/EventManager';
import AbstractNetworkManager from './Manager/AbstractNetworkManager';
import ShapeManager from './Manager/ShapeManager';
import CanvasManager from './Manager/CanvasManager';
import PermissionManager from './Manager/PermissionManager';

class Engine {
  permissionManager: PermissionManager;
  eventManager: EventManager;
  networkManager: AbstractNetworkManager | null;
  shapeManager: ShapeManager;
  canvasManager: CanvasManager;

  constructor(canvasElement: HTMLCanvasElement, networkManager: AbstractNetworkManager | null = null) {
    this.canvasManager = new CanvasManager(canvasElement);
    this.shapeManager = new ShapeManager(this.canvasManager);
    this.eventManager = new EventManager(this.canvasManager);
    this.permissionManager = new PermissionManager();
    this.networkManager = networkManager;

    if (networkManager !== null) this.registerNetworkManager(networkManager);
    else this.networkManager = null;

    this.eventManager.subscribeCanvasEventHandler(this.shapeManager.internalEventManager);
    this.eventManager.subscribeDocumentEventHandler(this.shapeManager.internalEventManager);
    this.eventManager.subscribeWindowEventHandler(this.canvasManager);
  }

  registerNetworkManager(networkManager: AbstractNetworkManager): void {
    this.networkManager = networkManager;
    this.networkManager.subscribe(this.permissionManager);
    this.networkManager.subscribe(this.shapeManager);
    this.networkManager.subscribe(this.shapeManager.undoRedoManager);
    this.shapeManager.subscribe(this.networkManager);
  }
}

export default Engine;

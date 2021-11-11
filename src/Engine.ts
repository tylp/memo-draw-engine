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

  constructor(canvasElement: HTMLCanvasElement, networkManager: AbstractNetworkManager | null = null) {
    const canvasManager = new CanvasManager(canvasElement);
    this.shapeManager = new ShapeManager(canvasManager);
    this.eventManager = new EventManager(canvasElement);
    this.permissionManager = new PermissionManager();
    this.networkManager = networkManager;

    if (networkManager !== null) this.registerNetworkManager(networkManager);
    else this.networkManager = null;

    this.eventManager.subscribeCanvasEventHandler(this.shapeManager.internalEventManager);
    this.eventManager.subscribeDocumentEventHandler(this.shapeManager.internalEventManager);
  }

  registerNetworkManager(networkManager: AbstractNetworkManager): void {
    this.networkManager = networkManager;
    this.networkManager.subscribe(this.permissionManager);
    this.networkManager.subscribe(this.shapeManager);
    this.shapeManager.subscribe(this.networkManager);
  }
}

export default Engine;

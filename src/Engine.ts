import canvas from './Canvas';
import EventManager from './Manager/EventManager';
import AbstractNetworkManager from './Manager/AbstractNetworkManager';
import ShapeManager from './Manager/ShapeManager';

class Engine {
  eventManager: EventManager;
  networkManager: AbstractNetworkManager | null;
  shapeManager: ShapeManager;

  constructor(canvasId: string, networkManager: AbstractNetworkManager | null = null) {
    canvas.initialize(canvasId);

    this.eventManager = new EventManager(canvas.canvasElement);
    this.eventManager.registerDefaultCanvasAndDocumentEvents();
    this.shapeManager = new ShapeManager();
    this.networkManager = networkManager;

    if (networkManager !== null) this.registerNetworkManager(networkManager);
    else this.networkManager = null;

    this.eventManager.subscribeCanvasEventHandler(this.shapeManager);
    this.eventManager.subscribeDocumentEventHandler(this.shapeManager);
  }

  registerNetworkManager(networkManager: AbstractNetworkManager): void {
    this.networkManager = networkManager;
    this.networkManager.subscribe(this.shapeManager);
    this.shapeManager.subscribe(this.networkManager);
  }
}

export default Engine;

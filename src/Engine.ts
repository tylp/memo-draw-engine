import canvas from './Canvas';
import EventManager from './Manager/EventManager';
import NetworkManager from './Manager/NetworkManager';
import ShapeManager from './Manager/ShapeManager';

class Engine {
  eventManager: EventManager;
  networkManager: NetworkManager | null;
  shapeManager: ShapeManager;

  constructor(canvasID : string, networkManager : NetworkManager | null = null) {
    canvas.initialize(canvasID);

    this.eventManager = new EventManager(canvas.canvasElement);
    this.shapeManager = new ShapeManager();
    this.networkManager = networkManager;

    if (networkManager !== null) this.registerNetworkManager(networkManager);
    else this.networkManager = null;

    this.eventManager.subscribeCanvasEventHandler(this.shapeManager);
    this.eventManager.subscribeDocumentEventHandler(this.shapeManager);
  }

  registerNetworkManager(networkManager : NetworkManager) : void {
    this.networkManager = networkManager;
    this.networkManager.subscribe(this.shapeManager);
    this.shapeManager.subscribe(this.networkManager);
  }
}

export default Engine;

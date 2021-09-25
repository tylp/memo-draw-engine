import Point from './Point';
import ActionType from './Action/ActionType';
import ShapeType from './Shapes/ShapeType';
import canvas from './Canvas';
import EventManager from './Manager/EventManager';
import ActionManager from './Manager/ActionManager';
import ShapeManager from './Manager/ShapeManager';
import StyleManager from './Manager/StyleManager';
import NetworkManager from './Manager/NetworkManager';

const eventManager = new EventManager(canvas.canvasElement);
const networkManager = new NetworkManager();
const actionManager = new ActionManager();
const shapeManager = new ShapeManager();
const styleManager = new StyleManager();

networkManager.subscribe(actionManager);

actionManager.subscribe(shapeManager, ActionType.shape);
actionManager.subscribe(styleManager, ActionType.style);

shapeManager.subscribe(networkManager);
styleManager.subscribe(networkManager);

eventManager.subscribeCanvasEventHandler(shapeManager);
eventManager.subscribeDocumentEventHandler(actionManager);

networkManager.on({
  type: ActionType.shape,
  parameters: {
    type: ShapeType.EllipseStroke,
    parameters: {
      originPoint: new Point(50, 100),
      width: 400,
      height: 300,
    },
  },
});

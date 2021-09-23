import networkManager from './NetworkManager';
import { shapeManager } from './ShapeManager';
import styleManager from './StyleManager';
import ShapeInfo from '../Shapes/ShapeInfo';
import Style from '../Style/Style';
import Do from './Do';
import Action from '../Action/Action';
import ActionType from '../Action/ActionType';

class ActionManager {
  actions : Array<Action> = [];

  receive(action : Action) : void {
    this.actions.push(action);
    this.dispatch(action);
  }

  emit(action : Action) : void {
    this.actions.push(action);
    networkManager.emit(action);
  }

  dispatch(action : Action) : void {
    switch (action.type) {
      case ActionType.undo:
        this.undo(); break;
      case ActionType.redo:
        this.redo(); break;
      case ActionType.style:
        styleManager.handle(action.parameters as Style); break;
      case ActionType.shape:
        shapeManager.handle(action.parameters as ShapeInfo); break;
      default:
        throw new TypeError(`Undefined action type :${action.type}`);
    }
  }

  undo() : void {
    const manager = this.getManager();
    manager?.undo();
  }

  redo() : void {
    const manager = this.getManager();
    manager?.redo();
  }

  private getManager() : Do | undefined {
    const lastAction = this.getLastAction();
    if (!lastAction) return undefined;
    if (lastAction.type === ActionType.shape) return shapeManager;
    return styleManager;
  }

  private getLastAction() : Action | undefined {
    return this.actions.find(
      (action) => action.type === ActionType.shape || action.type === ActionType.style,
    );
  }
}

const actionManager = new ActionManager();
export default actionManager;

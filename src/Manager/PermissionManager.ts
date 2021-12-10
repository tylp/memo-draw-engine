import { PermissionParameter, DrawPermission } from '../Permission';
import ActionType from '../Action/ActionType';
import IAction from '../Action/IAction';
import IObserver from '../Observer/IObserver';
import ShapeManager from './ShapeManager';
import DrawState from '../DrawState';

class PermissionManager implements IObserver<IAction> {
  shapeManager: ShapeManager;
  drawState: DrawState;

  constructor(shapeManager: ShapeManager, drawState: DrawState) {
    this.shapeManager = shapeManager;
    this.drawState = drawState;
  }

  update(elem: IAction): void {
    if (elem.type !== ActionType.Permission) return;
    const permissionParameter = elem.parameters as PermissionParameter;
    // Stop current draw if new permission doesnt allow to draw
    if (permissionParameter.type === DrawPermission.Slave) {
      this.shapeManager.internalEventManager.drawFinish();
    }
    this.drawState.drawPermission = permissionParameter.type;
  }
}

export default PermissionManager;

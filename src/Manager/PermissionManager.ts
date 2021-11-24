import drawState from '../DrawState';
import { PermissionParameter, DrawPermission } from '../Permission';
import ActionType from '../Action/ActionType';
import IAction from '../Action/IAction';
import IObserver from '../Observer/IObserver';
import ShapeManager from './ShapeManager';

class PermissionManager implements IObserver<IAction> {
  shapeManager: ShapeManager;

  constructor(shapeManager: ShapeManager) {
    this.shapeManager = shapeManager;
  }

  update(elem: IAction): void {
    if (elem.type !== ActionType.Permission) return;
    const permissionParameter = elem.parameters as PermissionParameter;
    // Stop current draw if new permission doesnt allow to draw
    if (permissionParameter.type === DrawPermission.Slave) {
      this.shapeManager.internalEventManager.drawFinish();
    }
    drawState.drawPermission = permissionParameter.type;
  }
}

export default PermissionManager;

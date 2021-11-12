import drawState from '../DrawState';
import { PermissionParameter } from '../Permission';
import ActionType from '../Action/ActionType';
import IAction from '../Action/IAction';
import IObserver from '../Observer/IObserver';

class PermissionManager implements IObserver<IAction> {
  update(elem: IAction): void {
    if (elem.type !== ActionType.Permission) return;
    const permissionParameter = elem.parameters as PermissionParameter;
    drawState.drawPermission = permissionParameter.type;
  }
}

export default PermissionManager;

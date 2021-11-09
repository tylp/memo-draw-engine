import IAction from '../Action/IAction';
import AbstractObservable from '../Observer/AbstractObservable';
import IObserver from '../Observer/IObserver';

abstract class AbstractNetworkManager extends AbstractObservable<IAction> implements IObserver<IAction> {
  // Override this to emit the IAction over the network
  abstract update(elem: IAction): void;

  // Default function to notify the engine
  on(info: unknown): void {
    const action = info as IAction;
    if (action !== null) this.notify(action);
  }
}

export default AbstractNetworkManager;

import IAction from '../Action/IAction';
import AbstractObservable from '../Observer/AbstractObservable';
import IObserver from '../Observer/IObserver';

// eslint-disable-next-line max-len
abstract class AbstractNetworkManager extends AbstractObservable<IAction> implements IObserver<IAction> {
  // Override this to emit the IAction over the network
  abstract update(elem: IAction): void;

  // Default function to notify the engine
  // You can override or inherit this function
  // But be sure to call notify
  on(action : IAction) : void {
    this.notify(action);
  }
}

export default AbstractNetworkManager;

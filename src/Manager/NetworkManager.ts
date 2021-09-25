import IAction from '../Action/IAction';
import AbstractObservable from '../Observer/AbstractObservable';
import IObserver from '../Observer/IObserver';

class NetworkManager extends AbstractObservable<IAction> implements IObserver<IAction> {
  update(elem: IAction): void {
    console.log('emit', elem);
  }

  on(action : IAction) : void {
    this.notify(action);
  }
}

export default NetworkManager;

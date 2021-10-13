import ActionType from '../Action/ActionType';
import IDocumentEventHandler from './IDocumentEventHandler';
import IAction from '../Action/IAction';
import AbstractObservable from '../Observer/AbstractObservable';
import IObserver from '../Observer/IObserver';

// eslint-disable-next-line max-len
abstract class AbstractNetworkManager extends AbstractObservable<IAction> implements IObserver<IAction>, IDocumentEventHandler {
  // Override this to emit the IAction over the network
  abstract update(elem: IAction): void;

  // Default function to notify the engine
  on(info: unknown): void {
    const action = info as IAction;
    if (action !== null) this.notify(action);
  }

  undo(): void {
    this.update({ type: ActionType.undo, parameters: null });
  }

  redo(): void {
    this.update({ type: ActionType.redo, parameters: null });
  }
}

export default AbstractNetworkManager;

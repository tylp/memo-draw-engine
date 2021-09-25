import IAction from '../Action/IAction';
import ActionType from '../Action/ActionType';
import IObserver from '../Observer/IObserver';
import IDo from './IDo';
import IDocumentEventHandler from './IDocumentEventHandler';

class ActionManager implements IObserver<IAction>, IDocumentEventHandler {
  actions : Array<IAction> = [];
  observers: Array<{ observer : IObserver<IAction> & IDo, type : ActionType }> = [];

  subscribe(observer : IObserver<IAction> & IDo, type : ActionType) : void {
    this.observers.push({ observer, type });
  }

  update(elem: IAction): void {
    this.actions.push(elem);
    const lastAction = this.actions.find(this.typeIsNotUndoOrRedo);
    if (lastAction === undefined) return;
    const observers = this.observers.filter((obs) => obs.type === lastAction.type);

    if (this.typeIsNotUndoOrRedo(elem)) {
      observers.forEach((obs) => obs.observer.update(lastAction));
      return;
    }

    if (elem.type === ActionType.redo) {
      observers.forEach((obs) => obs.observer.redo());
      return;
    }

    if (elem.type === ActionType.undo) {
      observers.forEach((obs) => obs.observer.undo());
    }
  }

  private typeIsNotUndoOrRedo(action : IAction) : boolean {
    return action.type !== ActionType.redo && action.type !== ActionType.undo;
  }

  undo(): void {
    this.update({ type: ActionType.undo, parameters: null });
  }
  redo(): void {
    this.update({ type: ActionType.redo, parameters: null });
  }
}

export default ActionManager;

import Do from './Do';

abstract class AbstractDo<T> implements Do {
  dones : Array<T> = [];
  undones : Array<T> = [];

  undo(): void {
    const elem : T | undefined = this.dones.pop();
    if (elem === undefined) return;
    this.undones.push(elem);
    this.handleUndo();
  }

  redo(): void {
    const elem : T | undefined = this.undones.pop();
    if (elem === undefined) return;
    this.dones.push(elem);
    this.handleRedo();
  }

  abstract handleUndo() : void;
  abstract handleRedo() : void;
}

export default AbstractDo;

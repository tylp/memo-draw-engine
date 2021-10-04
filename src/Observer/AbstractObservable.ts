import IObserver from './IObserver';
import IObservable from './IObservable';

abstract class AbstractObservable<T> implements IObservable<T> {
  observers: Array<IObserver<T>> = [];

  subscribe(observer: IObserver<T>): void {
    this.observers.push(observer);
  }

  notify(elem: T): void {
    this.observers.forEach((obs) => obs.update(elem));
  }
}

export default AbstractObservable;

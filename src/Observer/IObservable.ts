import IObserver from './IObserver';

interface IObservable<T> {
  subscribe(observer : IObserver<T>) : void;
  notify(elem : T) : void
}

export default IObservable;

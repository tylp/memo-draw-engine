interface IObserver<T> {
  update(elem: T): void;
}

export default IObserver;

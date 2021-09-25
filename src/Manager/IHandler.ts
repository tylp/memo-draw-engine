interface IHandler<T> {
  handle(elem : T) : void;
  emit(elem : T) : void;
}

export default IHandler;

interface Handler<T> {
  handle(elem : T) : void;
  emit(elem : T) : void;
}

export default Handler;

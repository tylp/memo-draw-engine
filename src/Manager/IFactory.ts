interface IFactory<Info, T> {
  build(info : Info) : T;
  // Do not return directly Action to enforce parameters type
  serialize(elem : T) : Info;
}

export default IFactory;

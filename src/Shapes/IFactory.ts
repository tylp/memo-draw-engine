interface IFactory<Info, T> {
  build(info: Info): T;
}

export default IFactory;

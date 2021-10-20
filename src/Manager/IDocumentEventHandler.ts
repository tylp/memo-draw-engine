interface IDocumentEventHandler {
  undo(): void;
  redo(): void;
  documentMouseUp(): void;
}

export default IDocumentEventHandler;

import Point from '../Point';

interface IDocumentEventHandler {
  undo(): void;
  redo(): void;
  documentUp(): void;
  documentMove(point: Point): void;
}

export default IDocumentEventHandler;

import Point from '../Point';

interface IDocumentEventHandler {
  undo(): void;
  redo(): void;
  documentMouseUp(): void;
  documentMouseMove(point: Point): void;
}

export default IDocumentEventHandler;

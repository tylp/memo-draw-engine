/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import Point from '../Point';
import ShapeType from './ShapeType';
import type Shape from './Shape';
import type IShapeInfo from './IShapeInfo';
import Pencil from './Pencil';
import RectangleFull from './RectangleFull';
import RectangleStroke from './RectangleStroke';
import EllipseFull from './EllipseFull';
import EllipseStroke from './EllipseStroke';
import Line from './Line';
import Fill from './Fill';
import DraggableShape from './DraggableShape';
import UpdatableShape from './UpdatableShape';
import AlphaColor from '../Color/AlphaColor';
import DrawState from '../DrawState';

type StyleInfo = { color: AlphaColor, thickness: number };

class ShapeFactory {
  drawState: DrawState;

  constructor(drawState: DrawState) {
    this.drawState = drawState;
  }

  build(info: IShapeInfo): Shape {
    const { id, color, thickness } = info.parameters;

    const styleInfo = {
      color: color
        ? new AlphaColor(color.red, color.green, color.blue, color.alpha)
        : this.drawState.getAlphaColor(),
      thickness: thickness || this.drawState.thickness,
    };

    const shape = this.create(info.type, id, styleInfo);

    // info.parameters is the basePoint when a shape is created by the drawer
    if (info.parameters instanceof Point) {
      this.setOriginPointshape(shape, info.parameters);
    } else {
      this.setInfo(shape, info.parameters);
    }

    return shape;
  }

  create(shapeType: ShapeType, id: string | undefined, styleInfo: StyleInfo): Shape {
    switch (shapeType) {
      case ShapeType.Pencil:
        return new Pencil(id, styleInfo.color, styleInfo.thickness);
      case ShapeType.RectangleFull:
        return new RectangleFull(id, styleInfo.color, styleInfo.thickness);
      case ShapeType.RectangleStroke:
        return new RectangleStroke(id, styleInfo.color, styleInfo.thickness);
      case ShapeType.EllipseFull:
        return new EllipseFull(id, styleInfo.color, styleInfo.thickness);
      case ShapeType.EllipseStroke:
        return new EllipseStroke(id, styleInfo.color, styleInfo.thickness);
      case ShapeType.Line:
        return new Line(id, styleInfo.color, styleInfo.thickness);
      case ShapeType.Fill:
        return new Fill(id, styleInfo.color, styleInfo.thickness);
      default:
        throw new Error('Shape is not implemented');
    }
  }

  setInfo(shape: Shape, parameter: any): void {
    if (shape instanceof UpdatableShape) {
      shape.startDate = parameter.startDate as number;
      shape.endDate = parameter.endDate as number;
    }

    if (shape instanceof Fill || shape instanceof DraggableShape) {
      this.setOriginPointshape(shape, new Point(parameter.originPoint.x, parameter.originPoint.y));
    }

    if (shape instanceof DraggableShape) {
      shape.height = parameter.height as number;
      shape.width = parameter.width as number;
    }

    if (shape instanceof Pencil) {
      shape.points = parameter.points as Array<Point>;
    }
  }

  setOriginPointshape(shape: Shape, basePoint: Point): void {
    if (shape instanceof Fill || shape instanceof DraggableShape) {
      shape.originPoint = basePoint;
    } else if (shape instanceof Pencil) {
      shape.points.push(basePoint);
    }
  }
}

export default ShapeFactory;

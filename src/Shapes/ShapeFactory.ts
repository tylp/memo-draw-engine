/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import Utils from '../Utils';
import Point from '../Point';
import IFactory from './IFactory';
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
import drawState from '../DrawState';
import AlphaColor from '../Color/AlphaColor';

class ShapeFactory implements IFactory<IShapeInfo, Shape> {
  build(info: IShapeInfo): Shape {
    const { id, color, thickness } = info.parameters;

    const styleInfo = {
      color: color
        ? new AlphaColor(color.red, color.green, color.blue, color.alpha)
        : drawState.getAlphaColor(),
      thickness: thickness || drawState.thickness,
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

  create(shapeType: ShapeType, id: string, styleInfo: { color: AlphaColor, thickness: number }): Shape {
    const shapeId = id || Utils.generateUID();
    switch (shapeType) {
      case ShapeType.Pencil:
        return new Pencil(shapeId, styleInfo.color, styleInfo.thickness);
      case ShapeType.RectangleFull:
        return new RectangleFull(shapeId, styleInfo.color, styleInfo.thickness);
      case ShapeType.RectangleStroke:
        return new RectangleStroke(shapeId, styleInfo.color, styleInfo.thickness);
      case ShapeType.EllipseFull:
        return new EllipseFull(shapeId, styleInfo.color, styleInfo.thickness);
      case ShapeType.EllipseStroke:
        return new EllipseStroke(shapeId, styleInfo.color, styleInfo.thickness);
      case ShapeType.Line:
        return new Line(shapeId, styleInfo.color, styleInfo.thickness);
      case ShapeType.Fill:
        return new Fill(shapeId, styleInfo.color, styleInfo.thickness);
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

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import Point from '../Point';
import IFactory from '../Manager/IFactory';
import ShapeType from './ShapeType';
import type Shape from './Shape';
import type IShapeInfo from './IShapeInfo';
import Draw from './Draw';
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
    const styleInfo = {
      color: info.parameters.color || drawState.getAlphaColor(),
      thickness: info.parameters.thickness || drawState.thickness,
    };
    const shape = this.create(info.type, styleInfo);
    // info.parameters is the basePoint when a shape is created by the drawer
    if (info.parameters instanceof Point) {
      this.setOriginPointshape(shape, info.parameters);
    } else {
      this.setInfo(shape, info.parameters);
    }
    return shape;
  }

  create(shapeType : ShapeType, styleInfo : { color: AlphaColor, thickness : number }) : Shape {
    switch (shapeType) {
      case ShapeType.Draw:
        return new Draw(styleInfo.color, styleInfo.thickness);
      case ShapeType.RectangleFull:
        return new RectangleFull(styleInfo.color, styleInfo.thickness);
      case ShapeType.RectangleStroke:
        return new RectangleStroke(styleInfo.color, styleInfo.thickness);
      case ShapeType.EllipseFull:
        return new EllipseFull(styleInfo.color, styleInfo.thickness);
      case ShapeType.EllipseStroke:
        return new EllipseStroke(styleInfo.color, styleInfo.thickness);
      case ShapeType.Line:
        return new Line(styleInfo.color, styleInfo.thickness);
      case ShapeType.Fill:
        return new Fill(styleInfo.color, styleInfo.thickness);
      default:
        throw new Error('Shape is not implemented');
    }
  }

  setInfo(shape : Shape, parameter : any) : void {
    if (shape instanceof UpdatableShape) {
      shape.startDate = parameter.startDate as number;
      shape.endDate = parameter.endDate as number;
    }

    if (shape instanceof Fill || shape instanceof DraggableShape) {
      this.setOriginPointshape(shape, parameter.originPoint as Point);
    }

    if (shape instanceof DraggableShape) {
      shape.height = parameter.height as number;
      shape.width = parameter.width as number;
    }

    if (shape instanceof Draw) {
      shape.points = parameter.points as Array<Point>;
    }
  }

  setOriginPointshape(shape : Shape, basePoint : Point) : void {
    if (shape instanceof Fill || shape instanceof DraggableShape) {
      shape.originPoint = basePoint;
    } else if (shape instanceof Draw) {
      shape.points.push(basePoint);
    }
  }

  serialize(elem: Shape): IShapeInfo {
    return { type: this.getType(elem), parameters: elem.exportInfo() };
  }

  getType(shape: Shape) : ShapeType {
    switch (shape.constructor) {
      case Draw:
        return ShapeType.Draw;
      case RectangleFull:
        return ShapeType.RectangleFull;
      case RectangleStroke:
        return ShapeType.RectangleStroke;
      case EllipseFull:
        return ShapeType.EllipseFull;
      case EllipseStroke:
        return ShapeType.EllipseStroke;
      case Line:
        return ShapeType.Line;
      case Fill:
        return ShapeType.Fill;
      default:
        throw new Error('Shape is not implemented');
    }
  }
}

export default ShapeFactory;

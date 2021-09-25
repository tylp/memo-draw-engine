import ActionType from '../Action/ActionType';
import DrawState from '../DrawState';
import Color from '../Color/Color';
import AbstractDo from './AbstractDo';
import IStyle from '../Style/IStyle';
import StyleType from '../Style/StyleType';
import canvas from '../Canvas';
import IObserver from '../Observer/IObserver';
import IAction from '../Action/IAction';

class StyleManager extends AbstractDo<IStyle> implements IObserver<IAction> {
  update(elem: IAction): void {
    const style = elem.parameters as IStyle;
    this.dones.push(style);
    this.undones = [];
    this.apply(style);
  }

  handleUndo(): void {
    this.dones.forEach((style) => this.apply(style));
  }

  handleRedo(): void {
    const styleToRedo = this.dones[this.dones.length - 1];
    this.apply(styleToRedo);
  }

  emit(elem : IStyle) : void {
    this.notify({
      type: ActionType.style,
      parameters: elem,
    });
  }

  apply(style : IStyle) : void {
    switch (style.type) {
      case StyleType.color:
        DrawState.color = style.parameters as Color;
        break;
      case StyleType.opacity:
        DrawState.opacity = style.parameters as number;
        break;
      case StyleType.thickness:
        DrawState.thickness = style.parameters as number;
        break;
      default:
        throw new TypeError(`Unkown style stype : ${style.type}`);
    }
    canvas.setStyle();
  }
}

export default StyleManager;

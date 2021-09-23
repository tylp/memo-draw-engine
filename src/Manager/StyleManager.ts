import ActionType from '../Action/ActionType';
import DrawState from '../DrawState';
import Color from '../Color/Color';
import AbstractDo from './AbstractDo';
import Style from '../Style/Style';
import StyleType from '../Style/StyleType';
import canvas from '../Canvas';
import Handler from './Handler';
import actionManager from './ActionManager';

class StyleManager extends AbstractDo<Style> implements Handler<Style> {
  handleUndo(): void {
    this.dones.forEach((style) => this.apply(style));
  }

  handleRedo(): void {
    const styleToRedo = this.dones[this.dones.length - 1];
    this.apply(styleToRedo);
  }

  handle(elem : Style) : void {
    this.dones.push(elem);
    this.undones = [];
    this.apply(elem);
  }

  emit(elem : Style) {
    actionManager.emit({
      type: ActionType.style,
      parameters: elem,
    });
  }

  apply(style : Style) {
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

const styleManager = new StyleManager();
export default styleManager;

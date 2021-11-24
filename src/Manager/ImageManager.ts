import IAction from '../Action/IAction';
import ActionType from '../Action/ActionType';
import AbstractObservable from '../Observer/AbstractObservable';
import IObserver from '../Observer/IObserver';
import CanvasManager from './CanvasManager';

interface ImageParameter {
  image: string,
}

class ImageManager extends AbstractObservable<IAction> implements IObserver<IAction> {
  canvasManager: CanvasManager;

  constructor(canvasManager: CanvasManager) {
    super();
    this.canvasManager = canvasManager;
  }

  update(elem: IAction): void {
    switch (elem.type) {
      case ActionType.GetImage:
        this.sendImage();
        break;
      case ActionType.SetImage:
        this.putImage(elem.parameters as ImageParameter);
        break;
      default:
        break;
    }
  }

  public sendImage(): void {
    this.notify({
      type: ActionType.SendImage,
      parameters: {
        image: this.getImageFromCanvas(),
      },
    });
  }

  public async putImage(imageParam: ImageParameter): Promise<void> {
    const image = new Image();
    image.src = imageParam.image;
    await image.decode();
    this.canvasManager.backgroundCanvas.ctx.drawImage(image, 0, 0);
    this.canvasManager.backgroundCanvas.storeLast();
  }

  private getImageFromCanvas(): string {
    return this.canvasManager.backgroundCanvas.canvasElement.toDataURL();
  }
}

export default ImageManager;

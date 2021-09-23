import Action from '../Action/Action';
import actionManager from './ActionManager';

class NetworkManager {
  emit(action : Action) {
    console.log(action);
  }

  on(action : Action) {
    actionManager.receive(action);
  }
}

const networkManager = new NetworkManager();
export default networkManager;

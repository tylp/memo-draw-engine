import ActionType from './ActionType';

interface IAction {
  type: ActionType;
  parameters: unknown;
}

export default IAction;

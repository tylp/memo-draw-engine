import ActionType from './ActionType';

interface Action {
  type : ActionType;
  parameters : unknown;
}

export default Action;

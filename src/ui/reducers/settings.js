import { SAVE_SETTINGS } from '../constants/actions';

export default function(state = {}, action) {
  switch (action.type) {
  case SAVE_SETTINGS:
    return {
      ...state,
      savedAt: Date.now(),
    };
  default:
    return state;
  }
}

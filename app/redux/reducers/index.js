import { combineReducers } from 'redux';

import gpm from './gpm';
import menu from './menu';

export default combineReducers({
  gpm,
  menu,
});

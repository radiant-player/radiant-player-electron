import { combineReducers } from 'redux';

import gpm from './modules/gpm';
import menu from './modules/menu';

export default combineReducers({
  gpm,
  menu,
});

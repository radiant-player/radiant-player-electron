import {
  GPM_CHANGE_PLAYBACK,
  PLAYBACK_STATE_PAUSED,
  PLAYBACK_STATE_PLAYING,
  PLAYBACK_STATE_STOPPED,
} from '../gpm';
import defaultMenu from './defaultMenu';

const modifyItemByRedux = (menu, id, cb) => {
  if (Array.isArray(menu)) return menu.map(item => modifyItemByRedux(item, id, cb));

  if (typeof menu !== 'object') throw new Error(`Invalid menu item: ${menu}`);

  if (menu.redux === id) {
    return cb({ ...menu });
  }

  const hasReduxInSubmenu = (item) => (
    item.redux === id
      ? true
      : (item.submenu && item.submenu.find(subitem => hasReduxInSubmenu(subitem)))
  );

  if (hasReduxInSubmenu(menu)) {
    return {
      ...menu,
      submenu: modifyItemByRedux(menu.submenu, id, cb),
    };
  }

  return menu;
};

const playPauseLabels = {
  [PLAYBACK_STATE_PAUSED]: 'Play',
  [PLAYBACK_STATE_PLAYING]: 'Pause',
  [PLAYBACK_STATE_STOPPED]: 'Play/Pause',
};

const ACTION_HANDLERS = {
  [GPM_CHANGE_PLAYBACK]: (state, { payload }) => modifyItemByRedux(state, 'play-pause', item => ({
    ...item,
    label: playPauseLabels[payload],
    enabled: payload !== PLAYBACK_STATE_STOPPED,
  })),
};

const initialState = [
  ...defaultMenu,
];

export default function menuReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}

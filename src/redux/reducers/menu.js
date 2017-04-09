import {
  GPM_CHANGE_PLAYBACK,
  GPM_CHANGE_RATING,
  GPM_CHANGE_REPEAT,
  GPM_CHANGE_SHUFFLE,
} from '../actions/gpm';
import {
  PLAYBACK_STATE_PAUSED,
  PLAYBACK_STATE_PLAYING,
  PLAYBACK_STATE_STOPPED,
  RATING_STATE_THUMBS_DOWN,
  RATING_STATE_THUMBS_UP,
  REPEAT_STATE_LIST_REPEAT,
  REPEAT_STATE_NO_REPEAT,
  REPEAT_STATE_SINGLE_REPEAT,
  SHUFFLE_STATE_ALL_SHUFFLE,
} from './gpm';
import defaultMenu from './defaultMenu';

const modifyItemByRedux = (menu, id, cb) => {
  if (Array.isArray(menu)) return menu.map(item => modifyItemByRedux(item, id, cb));

  if (typeof menu !== 'object') throw new Error(`Invalid menu item: ${menu}`);

  if (menu.redux === id) {
    return cb({ ...menu });
  }

  const hasReduxInSubmenu = item => (
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

  [GPM_CHANGE_SHUFFLE]: (state, { payload }) => modifyItemByRedux(state, 'shuffle', item => ({
    ...item,
    checked: payload === SHUFFLE_STATE_ALL_SHUFFLE,
  })),

  [GPM_CHANGE_REPEAT]: (state, { payload }) => {
    let final = state;

    final = modifyItemByRedux(final, 'repeat-all', item => ({
      ...item,
      checked: payload === REPEAT_STATE_LIST_REPEAT,
    }));

    final = modifyItemByRedux(final, 'repeat-one', item => ({
      ...item,
      checked: payload === REPEAT_STATE_SINGLE_REPEAT,
    }));

    final = modifyItemByRedux(final, 'repeat-none', item => ({
      ...item,
      checked: payload === REPEAT_STATE_NO_REPEAT,
    }));

    return final;
  },

  [GPM_CHANGE_RATING]: (state, { payload }) => {
    let final = state;

    final = modifyItemByRedux(final, 'thumbs-up', item => ({
      ...item,
      checked: payload === RATING_STATE_THUMBS_UP,
    }));

    final = modifyItemByRedux(final, 'thumbs-down', item => ({
      ...item,
      checked: payload === RATING_STATE_THUMBS_DOWN,
    }));

    return final;
  },
};

const initialState = [
  ...defaultMenu,
];

export default function menuReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}

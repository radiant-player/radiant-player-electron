import { createAction } from 'redux-actions';

export const GPM_CHANGE_SONG = 'GPM_CHANGE_SONG';
export const GPM_CHANGE_SHUFFLE = 'GPM_CHANGE_SHUFFLE';
export const GPM_CHANGE_REPEAT = 'GPM_CHANGE_REPEAT';
export const GPM_CHANGE_PLAYBACK = 'GPM_CHANGE_PLAYBACK';
export const GPM_CHANGE_PLAYBACK_TIME = 'GPM_CHANGE_PLAYBACK_TIME';
export const GPM_CHANGE_RATING = 'GPM_CHANGE_RATING';

export const onChangeSong = createAction(GPM_CHANGE_SONG);
export const onChangeShuffle = createAction(GPM_CHANGE_SHUFFLE);
export const onChangeRepeat = createAction(GPM_CHANGE_REPEAT);
export const onChangePlayback = createAction(GPM_CHANGE_PLAYBACK);
export const onChangePlaybackTime = createAction(GPM_CHANGE_PLAYBACK_TIME);
export const onChangeRating = createAction(GPM_CHANGE_RATING);

export const actions = {
  onChangeSong,
  onChangeShuffle,
  onChangeRepeat,
  onChangePlayback,
  onChangePlaybackTime,
  onChangeRating,
};

export const PLAYBACK_STATE_STOPPED = 0;
export const PLAYBACK_STATE_PAUSED = 1;
export const PLAYBACK_STATE_PLAYING = 2;
export const PLAYBACK_STATES = {
  PLAYBACK_STATE_STOPPED,
  PLAYBACK_STATE_PAUSED,
  PLAYBACK_STATE_PLAYING,
};

const playbackStateNames = {
  [PLAYBACK_STATE_STOPPED]: 'stopped',
  [PLAYBACK_STATE_PAUSED]: 'paused',
  [PLAYBACK_STATE_PLAYING]: 'playing',
};

const ACTION_HANDLERS = {
  [GPM_CHANGE_SONG]: (state, { payload }) => ({
    ...state,
    song: payload,
  }),

  [GPM_CHANGE_SHUFFLE]: (state, { payload }) => ({
    ...state,
    shuffle: payload,
  }),

  [GPM_CHANGE_REPEAT]: (state, { payload }) => ({
    ...state,
    repeat: payload,
  }),

  [GPM_CHANGE_PLAYBACK]: (state, { payload }) => ({
    ...state,
    state: playbackStateNames[payload],
  }),

  [GPM_CHANGE_PLAYBACK_TIME]: (state, { payload }) => ({
    ...state,
    time: payload,
  }),

  [GPM_CHANGE_RATING]: (state, { payload }) => ({
    ...state,
    rating: payload,
  }),
};

const initialState = {
  song: {},
  state: 'stopped',
  time: {},
};

export default function gpmReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}

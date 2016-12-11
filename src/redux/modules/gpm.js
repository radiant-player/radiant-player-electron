import { createAction } from 'redux-actions';
import GMusic from 'gmusic.js';

export const GPM_CHANGE_SONG = 'GPM_CHANGE_SONG';
export const GPM_CHANGE_SHUFFLE = 'GPM_CHANGE_SHUFFLE';
export const GPM_CHANGE_REPEAT = 'GPM_CHANGE_REPEAT';
export const GPM_CHANGE_PLAYBACK = 'GPM_CHANGE_PLAYBACK';
export const GPM_OPTIMISTIC_SET_CURRENT_TIME = 'GPM_OPTIMISTIC_SET_CURRENT_TIME';
export const GPM_CHANGE_PLAYBACK_TIME = 'GPM_CHANGE_PLAYBACK_TIME';
export const GPM_CHANGE_RATING = 'GPM_CHANGE_RATING';

export const onChangeSong = createAction(GPM_CHANGE_SONG);
export const onChangeShuffle = createAction(GPM_CHANGE_SHUFFLE);
export const onChangeRepeat = createAction(GPM_CHANGE_REPEAT);
export const onChangePlayback = createAction(GPM_CHANGE_PLAYBACK);
export const onOptimisticSetCurrentTime = createAction(GPM_OPTIMISTIC_SET_CURRENT_TIME);
export const onChangePlaybackTime = createAction(GPM_CHANGE_PLAYBACK_TIME);
export const onChangeRating = createAction(GPM_CHANGE_RATING);

export const actions = {
  onChangeSong,
  onChangeShuffle,
  onChangeRepeat,
  onChangePlayback,
  onOptimisticSetCurrentTime,
  onChangePlaybackTime,
  onChangeRating,
};

// Playback states
export const PLAYBACK_STATE_STOPPED = GMusic.PlaybackStatus.STOPPED;
export const PLAYBACK_STATE_PAUSED = GMusic.PlaybackStatus.PAUSED;
export const PLAYBACK_STATE_PLAYING = GMusic.PlaybackStatus.PLAYING;
export const PLAYBACK_STATES = {
  PLAYBACK_STATE_STOPPED,
  PLAYBACK_STATE_PAUSED,
  PLAYBACK_STATE_PLAYING,
};

// Repeat modes
export const REPEAT_STATE_LIST_REPEAT = GMusic.RepeatStatus.LIST_REPEAT;
export const REPEAT_STATE_SINGLE_REPEAT = GMusic.RepeatStatus.SINGLE_REPEAT;
export const REPEAT_STATE_NO_REPEAT = GMusic.RepeatStatus.NO_REPEAT;
export const REPEAT_STATES = {
  REPEAT_STATE_LIST_REPEAT,
  REPEAT_STATE_SINGLE_REPEAT,
  REPEAT_STATE_NO_REPEAT,
};

// Shuffle modes
export const SHUFFLE_STATE_ALL_SHUFFLE = GMusic.ShuffleStatus.ALL_SHUFFLE;
export const SHUFFLE_STATE_NO_SHUFFLE = GMusic.ShuffleStatus.NO_SHUFFLE;
export const SHUFFLE_STATES = {
  SHUFFLE_STATE_ALL_SHUFFLE,
  SHUFFLE_STATE_NO_SHUFFLE,
};

// Rating states
export const RATING_STATE_NONE = '0';
export const RATING_STATE_THUMBS_UP = '5';
export const RATING_STATE_THUMBS_DOWN = '1';
export const RATING_STATES = {
  RATING_STATE_NONE,
  RATING_STATE_THUMBS_UP,
  RATING_STATE_THUMBS_DOWN,
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

  [GPM_OPTIMISTIC_SET_CURRENT_TIME]: (state, { payload }) => ({
    ...state,
    time: {
      ...state.time,
      current: payload,
    },
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

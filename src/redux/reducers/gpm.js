import GMusic from 'gmusic.js';

import {
  GPM_CHANGE_PLAYBACK_TIME,
  GPM_CHANGE_PLAYBACK,
  GPM_CHANGE_RATING,
  GPM_CHANGE_REPEAT,
  GPM_CHANGE_SHUFFLE,
  GPM_CHANGE_TRACK,
  GPM_CHANGE_VOLUME,
  GPM_CHANGE_YOUTUBE,
  GPM_CHECKED_YOUTUBE,
  GPM_CHANGED_AD_DISPLAY,
  GPM_OPTIMISTIC_SET_CURRENT_TIME,
} from '../actions/gpm';

// Youtube
export const NO_YOUTUBE_VIDEO = "No Youtube video";

//Ads
export const NO_ADS_PLAYING = "No Ads Playing";

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
  [GPM_CHANGE_TRACK]: (state, { payload }) => ({
    ...state,
    song: payload,
  }),

  [GPM_CHANGE_VOLUME]: (state, { payload }) => ({
    ...state,
    volume: payload,
  }),

  [GPM_CHECKED_YOUTUBE]: (state, { payload }) => ({
    ...state,
    hasYoutube: payload,
  }),

  [GPM_CHANGED_AD_DISPLAY]: (state, { payload }) => ({
    ...state,
    ad_state: payload,
  }),

  [GPM_CHANGE_YOUTUBE]: (state, { payload }) => ({
    ...state,
    youtube: payload,
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
  ad_state: NO_ADS_PLAYING,
  volume: 0,
  youtube: NO_YOUTUBE_VIDEO,
  hasYoutube: false,
};

export default function gpmReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}

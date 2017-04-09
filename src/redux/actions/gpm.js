import { createAction } from 'redux-actions';

export const GPM_CHANGE_PLAYBACK = 'GPM_CHANGE_PLAYBACK';
export const GPM_CHANGE_PLAYBACK_TIME = 'GPM_CHANGE_PLAYBACK_TIME';
export const GPM_CHANGE_RATING = 'GPM_CHANGE_RATING';
export const GPM_CHANGE_REPEAT = 'GPM_CHANGE_REPEAT';
export const GPM_CHANGE_SHUFFLE = 'GPM_CHANGE_SHUFFLE';
export const GPM_CHANGE_TRACK = 'GPM_CHANGE_TRACK';
export const GPM_OPTIMISTIC_SET_CURRENT_TIME = 'GPM_OPTIMISTIC_SET_CURRENT_TIME';

export const onChangePlayback = createAction(GPM_CHANGE_PLAYBACK);
export const onChangePlaybackTime = createAction(GPM_CHANGE_PLAYBACK_TIME);
export const onChangeRating = createAction(GPM_CHANGE_RATING);
export const onChangeRepeat = createAction(GPM_CHANGE_REPEAT);
export const onChangeShuffle = createAction(GPM_CHANGE_SHUFFLE);
export const onChangeTrack = createAction(GPM_CHANGE_TRACK);
export const onOptimisticSetCurrentTime = createAction(GPM_OPTIMISTIC_SET_CURRENT_TIME);

export default {
  onChangePlayback,
  onChangePlaybackTime,
  onChangeRating,
  onChangeRepeat,
  onChangeShuffle,
  onChangeTrack,
  onOptimisticSetCurrentTime,
};

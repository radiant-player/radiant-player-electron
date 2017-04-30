import { createAction } from 'redux-actions';

export const GPM_CHANGE_PLAYBACK = 'GPM_CHANGE_PLAYBACK';
export const GPM_CHANGE_PLAYBACK_TIME = 'GPM_CHANGE_PLAYBACK_TIME';
export const GPM_CHANGE_RATING = 'GPM_CHANGE_RATING';
export const GPM_CHANGE_REPEAT = 'GPM_CHANGE_REPEAT';
export const GPM_CHANGE_SHUFFLE = 'GPM_CHANGE_SHUFFLE';
export const GPM_CHANGE_TRACK = 'GPM_CHANGE_TRACK';
export const GPM_OPTIMISTIC_SET_CURRENT_TIME = 'GPM_OPTIMISTIC_SET_CURRENT_TIME';
export const GPM_OPTIMISTIC_SET_CURRENT_VOLUME = 'GPM_OPTIMISTIC_SET_CURRENT_VOLUME';
export const GPM_CHANGE_VOLUME = 'GPM_CHANGE_VOLUME';
export const GPM_CHANGE_YOUTUBE = 'GPM_CHANGE_YOUTUBE';
export const GPM_CHECKED_YOUTUBE = 'GPM_CHECKED_YOUTUBE';
export const GPM_USER_ROLLED_DICE = 'GPM_USER_ROLLED_DICE';
export const GPM_USER_REPLAY_BACK = 'GPM_USER_REPLAY_BACK';
export const GPM_USER_SEEKED_FORWARD = 'GPM_USER_SEEKED_FORWARD';
export const GPM_USER_OBTAINED_VOLUME = 'GPM_USER_OBTAINED_VOLUME';
export const GPM_USER_CLICKED_YOUTUBE = 'GPM_USER_CLICKED_YOUTUBE';
export const GPM_CHANGED_AD_DISPLAY = 'GPM_CHANGED_AD_DISPLAY';

export const onChangePlayback = createAction(GPM_CHANGE_PLAYBACK);
export const onChangePlaybackTime = createAction(GPM_CHANGE_PLAYBACK_TIME);
export const onChangeRating = createAction(GPM_CHANGE_RATING);
export const onChangeRepeat = createAction(GPM_CHANGE_REPEAT);
export const onChangeShuffle = createAction(GPM_CHANGE_SHUFFLE);
export const onChangeTrack = createAction(GPM_CHANGE_TRACK);
export const onChangeVolume = createAction(GPM_CHANGE_VOLUME);
export const onChangeYoutube = createAction(GPM_CHANGE_YOUTUBE);
export const onHasYoutube = createAction(GPM_CHECKED_YOUTUBE);
export const onChangeAdState = createAction(GPM_CHANGED_AD_DISPLAY);
export const onOptimisticSetCurrentTime = createAction(GPM_OPTIMISTIC_SET_CURRENT_TIME);
export const onOptimisticSetCurrentVolume = createAction(GPM_OPTIMISTIC_SET_CURRENT_VOLUME);
export const onOptimisticSetRolled = createAction(GPM_USER_ROLLED_DICE);
export const onOptimisticSetReplayBack = createAction(GPM_USER_REPLAY_BACK);
export const onOptimisticSetSeekForward = createAction(GPM_USER_SEEKED_FORWARD);
export const onOptimisticSetGetVolume = createAction(GPM_USER_OBTAINED_VOLUME);
export const onOptimisticSetYoutube = createAction(GPM_USER_CLICKED_YOUTUBE);

export default {
  onChangePlayback,
  onChangePlaybackTime,
  onChangeRating,
  onChangeRepeat,
  onChangeShuffle,
  onChangeTrack,
  onChangeVolume,
  onChangeYoutube,
  onHasYoutube,
  onChangeAdState,
  onOptimisticSetCurrentTime,
  onOptimisticSetCurrentVolume,
  onOptimisticSetRolled,
  onOptimisticSetReplayBack,
  onOptimisticSetSeekForward,
  onOptimisticSetGetVolume,
  onOptimisticSetYoutube,
};

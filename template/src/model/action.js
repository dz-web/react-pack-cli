import * as ActionTypes from './action-types';

export function syncAction(data) {
  return {
    type: ActionTypes.SYNC_ACTION,
    data,
  };
}

import * as t from './types'

export const addToLocalExperimentConfig = (payload) => ({
  type: t.ADD_TO_LOCAL_EXPERIMENT_CONFIG,
  payload,
})

export const confirm = (payload) => ({
  type: t.CONFIRM,
  payload,
  meta: {
    payload,
    offline: {
      effect: {
        path: `experiments/confirm?activeId=${payload?.activeId}`,
        method: 'POST',
      },
      commit: { type: t.CONFIRM_SUCCESS },
      rollback: { type: t.CONFIRM_ERROR },
    },
  },
})

export const refresh = ({ forceTriggerUpdate, ...payload }) => ({
  type: t.REFRESH,
  payload,
  meta: {
    offline: {
      effect: {
        path: payload?.activeId
          ? `experiments?activeId=${payload.activeId}`
          : 'experiments',
      },
      commit: { type: t.REFRESH_SUCCESS, meta: { forceTriggerUpdate } },
      rollback: { type: t.REFRESH_ERROR },
    },
  },
})

export const removeFromLocalExperimentConfig = (payload) => ({
  type: t.REMOVE_FROM_LOCAL_EXPERIMENT_CONFIG,
  payload,
})

export const removeLocalExperiment = () => ({
  type: t.REMOVE_LOCAL_EXPERIMENT,
})

export const reset = (payload) => ({
  type: t.RESET,
  payload,
})

export const setAdditionalListItems = (payload) => ({
  type: t.SET_ADDITIONAL_LIST_ITEMS,
  payload,
})

export const signalConfigUpdate = (payload) => ({
  type: t.SIGNAL_CONFIG_UPDATE,
  payload,
})

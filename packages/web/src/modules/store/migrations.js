export const migrations = {
  '2.12.0': (state) => {
    /**
     * Multiaccounting
     */
    const hasData =
      state.profile &&
      state.profile.profile &&
      state.profile.profile.id &&
      state.user &&
      state.user.accessToken

    if (hasData) {
      const { id } = state.profile.profile
      const { accessToken, ...user } = state.user // eslint-disable-line
      return {
        ...state,
        __app__: {
          ...state.__app__,
          accounts: {
            activeUserId: id,
            [id]: {
              accessToken: state.user.accessToken,
              userId: id,
            },
          },
        },
        user,
      }
    }
    return {
      ...state,
      __app__: {
        ...state.__app__,
        accounts: { activeUserId: undefined },
      },
    }
  },
}

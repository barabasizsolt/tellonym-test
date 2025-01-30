/**
 * It's a common use case to navigate into a tabs navigator
 * and to access the navigation params in the sub tabs.
 * Since this is not supported by default and navigation.getParent()
 * does return an empty object, we enhance the navigation API
 * and combine all tabs params, making sure to preserve the
 * ones passed to the route directly, by spreading the acc last.
 */
export const getRouteWithMergedParams = (routes, route) =>
  routes.reduce(
    (acc, { params }) =>
      params
        ? {
            ...acc,
            params: {
              ...params,
              ...acc.params,
            },
          }
        : acc,
    route
  )

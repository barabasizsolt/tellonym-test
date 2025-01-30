import { DO_NOT_MUTATE } from '../underscore'

export const getNavigationParams = (_, props) =>
  props.route.params ?? DO_NOT_MUTATE.EMPTY.OBJECT

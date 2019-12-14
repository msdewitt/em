import { store } from '../store.js'

// util
import { unrank } from './unrank.js'
import { isContextViewActive } from './isContextViewActive.js'

/**
 * Splits a path into a contextChain based on contextViews.
 * @example (shown without ranks): splitChain(['A', 'B', 'A'], { B: true }) === [['A', 'B'], ['A']]
 */
export const splitChain = (path, { state = store.getState() } = {}) => {

  const contextChain = [[]]

  path.forEach((value, i) => {

    // push item onto the last component of the context chain
    contextChain[contextChain.length - 1].push(path[i]) // eslint-disable-line fp/no-mutating-methods

    // push an empty array when we encounter a contextView so that the next item gets pushed onto a new component of the context chain
    const showContexts = isContextViewActive(unrank(path.slice(0, i + 1)), { state })
    if (showContexts && i < path.length - 1) {
      contextChain.push([]) // eslint-disable-line fp/no-mutating-methods
    }
  })

  return contextChain
}

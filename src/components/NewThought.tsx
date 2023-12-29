/** A link that creates a new thought.
 *
 * @param type {button|bullet} Default: bullet.
 */
import classNames from 'classnames'
import { connect, useDispatch } from 'react-redux'
import Path from '../@types/Path'
import SimplePath from '../@types/SimplePath'
import State from '../@types/State'
import createThought from '../action-creators/createThought'
import cursorBack from '../action-creators/cursorBack'
import setCursor from '../action-creators/setCursor'
import { MAX_DISTANCE_FROM_CURSOR } from '../constants'
import asyncFocus from '../device/asyncFocus'
import getTextContentFromHTML from '../device/getTextContentFromHTML'
import { getChildrenRanked } from '../selectors/getChildren'
import getNextRank from '../selectors/getNextRank'
import store from '../stores/app'
import appendToPath from '../util/appendToPath'
import createId from '../util/createId'
import fastClick from '../util/fastClick'
import head from '../util/head'
import unroot from '../util/unroot'

interface NewThoughtProps {
  show?: boolean
  path: SimplePath
  cursor?: Path | null
  showContexts?: boolean
  label?: string
  value?: string
  type?: string
}

// eslint-disable-next-line jsdoc/require-jsdoc
const mapStateToProps = (state: State, props: NewThoughtProps) => {
  const { cursor } = state
  const children = getChildrenRanked(state, head(props.path))
  return {
    cursor,
    show: !children.length || children[children.length - 1].value !== '',
  }
}

/** An input element for a new thought that mimics a normal thought. */
const NewThought = ({ show, path, cursor, showContexts, label, value = '', type = 'bullet' }: NewThoughtProps) => {
  const depth = unroot(path).length
  const distance = cursor ? Math.max(0, Math.min(MAX_DISTANCE_FROM_CURSOR, cursor.length - depth - 1)) : 0
  const dispatch = useDispatch()

  /** Handles the click event. */
  const onClick = () => {
    const state = store.getState()

    // do not preventDefault or stopPropagation as it prevents cursor

    // do not allow clicks if hidden by autofocus
    if (distance > 0) {
      dispatch(cursorBack())
      return
    }

    const newRank = getNextRank(state, head(path))

    const newThoughtId = createId()

    dispatch(
      createThought({
        path,
        rank: newRank,
        value,
        id: newThoughtId,
      }),
    )

    asyncFocus()

    dispatch(
      setCursor({
        path: appendToPath(path, newThoughtId),
        offset: getTextContentFromHTML(value).length,
      }),
    )
  }

  return show ? (
    <ul style={{ marginTop: 0 }} className={'children-new'}>
      <li className='child leaf'>
        {type === 'bullet' ? <span className='bullet' /> : null}
        <div className='thought'>
          <a
            className={classNames({
              placeholder: type === 'bullet',
              button: type === 'button',
              'button-variable-width': type === 'button',
            })}
            {...fastClick(onClick)}
          >
            {label || <>Add a {showContexts ? 'context' : 'thought'}</>}
          </a>
        </div>
      </li>
    </ul>
  ) : null
}

export default connect(mapStateToProps)(NewThought)

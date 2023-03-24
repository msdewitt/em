import React from 'react'
import { connect, useDispatch } from 'react-redux'
import State from '../../@types/State'
import tutorialNext from '../../action-creators/tutorialNext'
import {
  HOME_TOKEN,
  TUTORIAL2_STEP_CONTEXT1_SUBTHOUGHT,
  TUTORIAL2_STEP_CONTEXT2_SUBTHOUGHT,
  TUTORIAL2_STEP_CONTEXT_VIEW_EXAMPLES,
  TUTORIAL2_STEP_CONTEXT_VIEW_OPEN,
  TUTORIAL2_STEP_START,
  TUTORIAL2_STEP_SUCCESS,
  TUTORIAL_STEP_AUTOEXPAND,
  TUTORIAL_STEP_FIRSTTHOUGHT_ENTER,
  TUTORIAL_STEP_SECONDTHOUGHT_ENTER,
  TUTORIAL_STEP_START,
  TUTORIAL_STEP_SUBTHOUGHT_ENTER,
  TUTORIAL_STEP_SUCCESS,
} from '../../constants'
import { getAllChildrenAsThoughts } from '../../selectors/getChildren'
import getSetting from '../../selectors/getSetting'
import headValue from '../../util/headValue'
import TutorialNavigationButton from './TutorialNavigationButton'
import { context1SubthoughtCreated, context2SubthoughtCreated } from './TutorialUtils'

// eslint-disable-next-line jsdoc/require-jsdoc
const mapStateToProps = (state: State) => {
  const {
    thoughts: { thoughtIndex },
    expanded = {},
  } = state
  return {
    thoughtIndex,
    expanded,
    rootChildren: getAllChildrenAsThoughts(state, HOME_TOKEN),
    tutorialChoice: +(getSetting(state, 'Tutorial Choice') || 0),
    cursorValue: state.cursor ? headValue(state, state.cursor) : null,
  }
}

// eslint-disable-next-line jsdoc/require-jsdoc
const TutorialNavigationNext = ({
  cursorValue,
  expanded,
  rootChildren,
  tutorialChoice,
  tutorialStep,
}: { tutorialStep: number } & ReturnType<typeof mapStateToProps>) => {
  const dispatch = useDispatch()
  return [
    TUTORIAL_STEP_START,
    TUTORIAL_STEP_SUCCESS,
    TUTORIAL2_STEP_START,
    TUTORIAL2_STEP_CONTEXT_VIEW_OPEN,
    TUTORIAL2_STEP_CONTEXT_VIEW_EXAMPLES,
    TUTORIAL2_STEP_SUCCESS,
  ].includes(tutorialStep) ||
    (tutorialStep === TUTORIAL_STEP_AUTOEXPAND && Object.keys(expanded).length === 0) ||
    ((tutorialStep === TUTORIAL_STEP_FIRSTTHOUGHT_ENTER ||
      tutorialStep === TUTORIAL_STEP_SECONDTHOUGHT_ENTER ||
      tutorialStep === TUTORIAL_STEP_SUBTHOUGHT_ENTER) &&
      (!cursorValue || cursorValue.length > 0)) ||
    (Math.floor(tutorialStep) === TUTORIAL2_STEP_CONTEXT1_SUBTHOUGHT &&
      context1SubthoughtCreated({ rootChildren, tutorialChoice })) ||
    (Math.floor(tutorialStep) === TUTORIAL2_STEP_CONTEXT2_SUBTHOUGHT &&
      context2SubthoughtCreated({ rootChildren, tutorialChoice })) ? (
    <TutorialNavigationButton
      clickHandler={() => dispatch(tutorialNext({}))}
      value={tutorialStep === TUTORIAL_STEP_SUCCESS || tutorialStep === TUTORIAL2_STEP_SUCCESS ? 'Finish' : 'Next'}
    />
  ) : (
    <span className='tutorial-next-wait text-small'>Complete the instructions to continue</span>
  )
}

const TutorialNavigationNextConnected = connect(mapStateToProps)(TutorialNavigationNext)

export default TutorialNavigationNextConnected
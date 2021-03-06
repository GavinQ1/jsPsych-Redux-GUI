import { connect } from 'react-redux';
import * as organizerActions from '../../../actions/organizerActions';
import TimelineItem from '../../../components/TimelineNodeOrganizer/SortableTreeMenu/TimelineItem';

const onPreview = (dispatch, ownProps, setKeyboardFocusId) => {
	dispatch((dispatch, getState) => {
		let experimentState = getState().experimentState;
		let previewId = experimentState.previewId;
		if (previewId === null || previewId !== ownProps.id) {
			dispatch(organizerActions.onPreviewAction(ownProps.id));
			ownProps.openTimelineEditorCallback();
			if (setKeyboardFocusId) setKeyboardFocusId(ownProps.id);
		} else {
			dispatch(organizerActions.onPreviewAction(null));
			// ownProps.closeTimelineEditorCallback();
			if (setKeyboardFocusId) setKeyboardFocusId(null);
		}
	})
}

const onToggle = (dispatch, ownProps) => {
	dispatch(organizerActions.onToggleAction(ownProps.id));
}

const toggleCollapsed = (dispatch, ownProps) => {
	dispatch(organizerActions.setCollapsed(ownProps.id));
}

const insertTimeline = (dispatch, ownProps) => {
	dispatch(organizerActions.addTimelineAction(ownProps.id));
}

const insertTrial = (dispatch, ownProps) => {
	dispatch(organizerActions.addTrialAction(ownProps.id));
}

const deleteTimeline = (dispatch, ownProps) => {
	dispatch(organizerActions.deleteTimelineAction(ownProps.id));
}

const duplicateTimeline = (dispatch, ownProps) => {
	dispatch(organizerActions.duplicateTimelineAction(ownProps.id));
}

export const listenKey = (e, getKeyboardFocusId, dispatch, ownProps) => {
	e.preventDefault();

	if (getKeyboardFocusId() === ownProps.id &&
		 e.which >= 37 && 
		 e.which <= 40) {
		dispatch(organizerActions.moveByKeyboardAction(ownProps.id, e.which));
	}
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;

	let node = experimentState[ownProps.id];
	let len = node.childrenById.length;
	return {
		isSelected: ownProps.id === experimentState.previewId,
		isEnabled: node.enabled,
		name: node.name,
		collapsed: node.collapsed,
		hasNoChildren: len === 0,
		childrenById: node.childrenById,
		parent: node.parent,
		lastItem: (len > 0) ? node.childrenById[len-1] : null
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	dispatch: dispatch,
	onClick: (setKeyboardFocusId) => { onPreview(dispatch, ownProps, setKeyboardFocusId) },
	onToggle: () => { onToggle(dispatch, ownProps) },
	toggleCollapsed: () => { toggleCollapsed(dispatch, ownProps) },
	insertTimeline: () => { insertTimeline(dispatch, ownProps)},
	insertTrial: () => { insertTrial(dispatch, ownProps)},
	deleteTimeline: () => { deleteTimeline(dispatch, ownProps)},
	duplicateTimeline: () => { duplicateTimeline(dispatch, ownProps) },
	listenKey: (e, getKeyboardFocusId) => { listenKey(e, getKeyboardFocusId, dispatch, ownProps) },
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineItem);
